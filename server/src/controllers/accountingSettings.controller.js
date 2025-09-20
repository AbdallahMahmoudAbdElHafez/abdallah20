import * as service from "../services/accountingSettings.service.js";

export async function listSettings(req, res, next) {
  try {
    const items = await service.listSettings(req.query);
    res.json(items);
  } catch (err) { next(err); }
}

export async function getSetting(req, res, next) {
  try {
    const item = await service.getSettingById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) { next(err); }
}

export async function createSetting(req, res, next) {
  try {
    const item = await service.createSetting(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function updateSetting(req, res, next) {
  try {
    const item = await service.updateSetting(req.params.id, req.body);
    res.json(item);
  } catch (err) { next(err); }
}

export async function deleteSetting(req, res, next) {
  try {
    await service.deleteSetting(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}
