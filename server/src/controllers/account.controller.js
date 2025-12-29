import AccountService from "../services/account.service.js";
import response from "../utils/response.js";

class AccountController {
  static async getAll(req, res, next) {
    try {
      const accounts = await AccountService.getAll();
      response.ok(res, accounts);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const account = await AccountService.create(req.body);
      response.ok(res, account, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const account = await AccountService.getById(req.params.id);
      if (!account) return response.notFound(res, "Account not found");
      response.ok(res, account);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const account = await AccountService.update(req.params.id, req.body);
      if (!account) return response.notFound(res, "Account not found");
      response.ok(res, account);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const account = await AccountService.delete(req.params.id);
      if (!account) return response.notFound(res, "Account not found");
      response.ok(res, { message: "Account deleted" });
    } catch (err) {
      next(err);
    }
  }

  /** 🔑 أكشن جديد */
  static async getByRoot(req, res, next) {
    try {
      const { rootId } = req.params;
      const accounts = await AccountService.getChildrenByRoot(rootId);
      response.ok(res, accounts);
    } catch (err) {
      next(err);
    }
  }

  static async postOpeningBalances(req, res, next) {
    try {
      const { contraAccountId } = req.body;
      const result = await AccountService.postOpeningBalancesBatch(contraAccountId);
      response.ok(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export default AccountController;
