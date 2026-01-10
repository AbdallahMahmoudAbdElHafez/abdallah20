// server/src/services/party.service.js
import { Account, City, Party, PartyCategory } from "../models/index.js";


class PartyService {
  static async getSuppliersAndBoth() {
    return await Party.findAll({
      where: {
        party_type: ["supplier", "both"],
      },
      include: [{ model: City, as: "city" }],
    });
  }

  static async getCustomersAndBoth() {
    return await Party.findAll({
      where: {
        party_type: ["customer", "both"],
      },
      include: [{ model: City, as: "city" }],
    });
  }
  static async getAll() {
    return await Party.findAll({ include: [PartyCategory, Account, { model: City, as: "city" }] });
  }

  static async getById(id) {
    return await Party.findByPk(id, { include: [PartyCategory, Account, { model: City, as: "city" }] });
  }

  static async create(data) {
    if (!data.account_id) {
      let accountName = "";
      if (data.party_type === "customer") accountName = "العملاء";
      else if (data.party_type === "supplier") accountName = "الموردين";

      if (accountName) {
        const account = await Account.findOne({ where: { name: accountName } });
        if (account) data.account_id = account.id;
      }
    }
    return await Party.create(data);
  }

  static async update(id, data) {
    const party = await Party.findByPk(id);
    if (!party) throw new Error("Party not found");

    if (data.party_type && (data.party_type !== party.party_type || !party.account_id)) {
      let accountName = "";
      if (data.party_type === "customer") accountName = "العملاء";
      else if (data.party_type === "supplier") accountName = "الموردين";

      if (accountName) {
        const account = await Account.findOne({ where: { name: accountName } });
        if (account) data.account_id = account.id;
      }
    }

    return await party.update(data);
  }

  static async delete(id) {
    const party = await Party.findByPk(id);
    if (!party) throw new Error("Party not found");
    return await party.destroy();
  }
}

export default PartyService;
