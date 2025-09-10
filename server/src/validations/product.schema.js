import Joi from 'joi';


export const createProductSchema = Joi.object({
name: Joi.string().max(150).required(),
price: Joi.number().precision(2).required(),
unit_id: Joi.number().integer().allow(null),
cost_price: Joi.number().precision(2).default(0),
});


export const updateProductSchema = Joi.object({
name: Joi.string().max(150),
price: Joi.number().precision(2),
unit_id: Joi.number().integer().allow(null),
cost_price: Joi.number().precision(2),
});