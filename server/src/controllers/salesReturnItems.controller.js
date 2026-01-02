import SalesReturnItemsService from '../services/salesReturnItems.service.js';

export const getAll = async (req, res, next) => {
    try {
        const result = await SalesReturnItemsService.getAll();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const result = await SalesReturnItemsService.getById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Item not found' });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const result = await SalesReturnItemsService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const result = await SalesReturnItemsService.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: 'Item not found' });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const result = await SalesReturnItemsService.delete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
