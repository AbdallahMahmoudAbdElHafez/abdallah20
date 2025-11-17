import { IssueVoucherType } from "../models/index.js";

class IssueVoucherTypesService {
  async getAll() {
    return IssueVoucherType.findAll({ order: [["id", "ASC"]] });
  }

  async getById(id) {
    return IssueVoucherType.findByPk(id);
  }

  async create(data) {
    return IssueVoucherType.create(data);
  }

  async update(id, data) {
    const record = await IssueVoucherType.findByPk(id);
    if (!record) return null;

    return record.update(data);
  }

  async delete(id) {
    const record = await IssueVoucherType.findByPk(id);
    if (!record) return null;

    await record.destroy();
    return true;
  }
}

export default new IssueVoucherTypesService();
