import * as companyService from '../services/company.service.js';

export const createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        if (req.file) {
            companyData.logo_path = req.file.path.replace(/\\/g, "/"); // Normalize path
        }
        const company = await companyService.createCompany(companyData);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const company = await companyService.getCompanyById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyData = req.body;
        if (req.file) {
            companyData.logo_path = req.file.path.replace(/\\/g, "/");
        }
        const company = await companyService.updateCompany(req.params.id, companyData);
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        await companyService.deleteCompany(req.params.id);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
