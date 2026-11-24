import { Account, sequelize } from "../models/index.js";
import _sequelizePkg from 'sequelize';
const { Op } = _sequelizePkg;
import { createOrAdjustOpeningBalanceEntry } from "./journal.service.js";

// الأنواع المسموح لها بالرصيد الافتتاحي
const ALLOWED_OPENING_BALANCE_TYPES = ['asset', 'liability', 'equity'];

class AccountService {
  static async getAll() {
    return await Account.findAll({
      include: [{ model: Account, as: "parent" }],
    });
  }

  static async getById(id) {
    return await Account.findByPk(id, {
      include: [{ model: Account, as: "parent" }],
    });
  }

  /**
   * إنشاء حساب جديد مع إنشاء قيد افتتاحي تلقائي
   */
  static async create(data) {
    const t = await sequelize.transaction();

    try {
      // التحقق من نوع الحساب للرصيد الافتتاحي
      const openingBalance = Number(data.opening_balance) || 0;
      if (openingBalance !== 0 && !ALLOWED_OPENING_BALANCE_TYPES.includes(data.account_type)) {
        throw new Error(`لا يمكن تحديد رصيد افتتاحي لحسابات ${data.account_type === 'revenue' ? 'الإيرادات' : 'المصروفات'}`);
      }

      // تحديد الطبيعة بناءً على النوع إذا لم تكن محددة
      if (!data.normal_balance) {
        data.normal_balance = ['asset', 'expense'].includes(data.account_type) ? 'debit' : 'credit';
      }

      // إنشاء الحساب
      const account = await Account.create(data, { transaction: t });

      // إنشاء قيد افتتاحي إذا كان هناك رصيد
      if (openingBalance !== 0) {
        await createOrAdjustOpeningBalanceEntry({
          accountId: account.id,
          accountName: account.name,
          normalBalance: account.normal_balance,
          newAmount: openingBalance,
          oldAmount: 0
        }, { transaction: t });
      }

      await t.commit();
      return account;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * تحديث حساب مع إنشاء قيد تسوية تلقائي عند تغيير الرصيد الافتتاحي
   */
  static async update(id, data) {
    const t = await sequelize.transaction();

    try {
      const account = await Account.findByPk(id, { transaction: t });
      if (!account) {
        await t.rollback();
        return null;
      }

      // حفظ الرصيد القديم
      const oldOpeningBalance = Number(account.opening_balance) || 0;
      const newOpeningBalance = data.opening_balance !== undefined
        ? Number(data.opening_balance)
        : oldOpeningBalance;

      // التحقق من نوع الحساب
      const accountType = data.account_type || account.account_type;
      if (newOpeningBalance !== 0 && !ALLOWED_OPENING_BALANCE_TYPES.includes(accountType)) {
        throw new Error(`لا يمكن تحديد رصيد افتتاحي لحسابات ${accountType === 'revenue' ? 'الإيرادات' : 'المصروفات'}`);
      }

      // تحديث الحساب
      await account.update(data, { transaction: t });

      // إنشاء قيد تسوية إذا تغير الرصيد
      if (oldOpeningBalance !== newOpeningBalance) {
        await createOrAdjustOpeningBalanceEntry({
          accountId: account.id,
          accountName: account.name,
          normalBalance: account.normal_balance,
          newAmount: newOpeningBalance,
          oldAmount: oldOpeningBalance
        }, { transaction: t });
      }

      await t.commit();
      return account;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  static async delete(id) {
    const account = await Account.findByPk(id);
    if (!account) return null;
    await account.destroy();
    return account;
  }

  /**
   * ترحيل مجمع لجميع الأرصدة الافتتاحية التي لم يتم ترحيلها بعد
   * Posts all opening balances that haven't been posted yet into ONE batch entry
   */
  static async postOpeningBalancesBatch(contraAccountId = 14) {
    const t = await sequelize.transaction();
    try {
      // 1. جلب جميع الحسابات التي لها رصيد افتتاحي
      const accounts = await Account.findAll({
        where: { opening_balance: { [Op.ne]: 0 } },
        transaction: t
      });

      if (accounts.length === 0) {
        await t.commit();
        return { message: "لا توجد حسابات بأرصدة افتتاحية للترحيل" };
      }

      // 2. تصفية الحسابات التي لديها بالفعل قيود افتتاحية (لتجنب التكرار في القيد المجمع)
      const { JournalEntry, JournalEntryLine, ReferenceType } = await import("../models/index.js");
      const refType = await ReferenceType.findOne({ where: { code: 'opening_balance' }, transaction: t });

      const accountsToPost = [];
      for (const acc of accounts) {
        let existingEntry = null;

        if (refType) {
          existingEntry = await JournalEntryLine.findOne({
            include: [{
              model: JournalEntry,
              as: 'journal_entry',
              where: { reference_type_id: refType.id, entry_type_id: 1 } // 1 = قيد افتتاحي
            }],
            where: { account_id: acc.id },
            transaction: t
          });
        }

        if (!existingEntry) {
          accountsToPost.push(acc);
        }
      }

      if (accountsToPost.length === 0) {
        await t.commit();
        return { message: "جميع الحسابات تم ترحيلها بالفعل" };
      }

      // 3. إنشاء القيد المجمع
      const { createBatchOpeningBalanceEntry } = await import("./journal.service.js");
      const entry = await createBatchOpeningBalanceEntry(accountsToPost, contraAccountId, { transaction: t });

      await t.commit();
      return {
        message: `تم ترحيل ${accountsToPost.length} حساب بنجاح في قيد واحد`,
        entry
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /** 🔑 دالة جلب كل الحسابات تحت حساب جذر */
  static async getChildrenByRoot(rootId) {
    return await Account.findAll({
      where: {
        [Op.or]: [
          { id: rootId },
          { parent_account_id: rootId }
        ]
      },
      order: [["name", "ASC"]],
    });
  }
}

export default AccountService;