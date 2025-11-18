import {IssueVoucherTypeAccount} from "../models/index.js";

class IssueVoucherTypeAccountsService {
  async findAll() {
    return IssueVoucherTypeAccount.findAll();
  }

  async findById(id) {
    return IssueVoucherTypeAccount.findByPk(id);
  }

  async findByType(typeId) {
    return IssueVoucherTypeAccount.findAll({
      where: { issue_voucher_type_id: typeId },
    });
  }

  async create(data) {
    return IssueVoucherTypeAccount.create(data);
  }

  async bulkCreate(list) {
    return IssueVoucherTypeAccount.bulkCreate(list);
  }

  async update(id, data) {
    return IssueVoucherTypeAccount.update(data, {
      where: { id },
    });
  }

  async delete(id) {
    return IssueVoucherTypeAccount.destroy({
      where: { id },
    });
  }

  async deleteByType(typeId) {
    return IssueVoucherTypeAccount.destroy({
      where: { issue_voucher_type_id: typeId },
    });
  }
}

export default new IssueVoucherTypeAccountsService();
