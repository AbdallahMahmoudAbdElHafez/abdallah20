import {Account} from "../models/index.js";
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
    static async create(data) {
    return await Account.create(data);
    }
    static async update(id, data) {
    const account = await Account.findByPk(id);
    if (!account) return null;
    return await account.update(data);
  } 
    static async delete(id) {
    const account = await Account.findByPk(id);
    if (!account) return null;
    await account.destroy();
    return account;
  }
  /** 🔑 دالة جديدة: جلب كل الحسابات تحت حساب جذر */
  static async getChildrenByRoot(rootId) {
    // تجيب كل الحسابات اللي parent_account_id = rootId
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