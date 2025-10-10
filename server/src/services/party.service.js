// server/src/services/party.service.js
import { Account, City, Party, PartyCategory } from "../models/index.js";


class PartyService {
  static async getSuppliersAndBoth() {
  return await Party.findAll({
    where: {
      party_type: ["supplier", "both"],
    },
  });
}
 static async getAll() {
    return await Party.findAll({include: [PartyCategory,Account,City]});
  }

 static async getById(id) {
    return await Party.findByPk(id, {include: [PartyCategory,Account,City]});
  }

 static async create(data) {
    return await Party.create(data);
  }

 static async update(id, data) {
    const party = await Party.findByPk(id);
    if (!party) throw new Error("Party not found");
    return await party.update(data);
  }

 static async delete(id) {
    const party = await Party.findByPk(id);
    if (!party) throw new Error("Party not found");
    return await party.destroy();
  }
}

export default PartyService;
