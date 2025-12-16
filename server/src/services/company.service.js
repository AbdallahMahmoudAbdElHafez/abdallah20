import { Company, City } from '../models/index.js';

export const createCompany = async (data) => {
    return await Company.create(data);
};

export const getAllCompanies = async () => {
    return await Company.findAll({
        include: [{ model: City, as: 'city', required: false }],
    });
};

export const getCompanyById = async (id) => {
    return await Company.findByPk(id, {
        include: [{ model: City, as: 'city', required: false }],
    });
};

export const updateCompany = async (id, data) => {
    const company = await Company.findByPk(id);
    if (!company) {
        throw new Error('Company not found');
    }
    return await company.update(data);
};

export const deleteCompany = async (id) => {
    const company = await Company.findByPk(id);
    if (!company) {
        throw new Error('Company not found');
    }
    return await company.destroy();
};
