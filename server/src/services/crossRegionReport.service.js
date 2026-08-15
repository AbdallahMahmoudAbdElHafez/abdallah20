import {
    SalesInvoice,
    SalesReturn,
    IssueVoucher,
    Party,
    Warehouse,
    City,
    Governate,
    sequelize
} from '../models/index.js';
import { Op } from 'sequelize';

const getCrossRegionReport = async (warehouseId, startDate, endDate) => {
    if (!warehouseId) {
        throw new Error('Warehouse ID is required');
    }

    // 1. Fetch Warehouse details with City and Governorate
    const warehouse = await Warehouse.findByPk(warehouseId, {
        include: [{
            model: City,
            as: 'city',
            include: [{
                model: Governate,
                as: 'governate'
            }]
        }]
    });

    if (!warehouse) {
        throw new Error('Warehouse not found');
    }

    const warehouseCityId = warehouse.city_id;
    const warehouseGovernateId = warehouse.city?.governate_id;

    // Date Filters
    const invoiceDateFilter = { warehouse_id: warehouseId };
    const returnDateFilter = { warehouse_id: warehouseId };
    const voucherDateFilter = { warehouse_id: warehouseId, party_id: { [Op.ne]: null } };

    if (startDate && endDate) {
        invoiceDateFilter.invoice_date = { [Op.between]: [startDate, endDate] };
        returnDateFilter.return_date = { [Op.between]: [startDate, endDate] };
        voucherDateFilter.issue_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        invoiceDateFilter.invoice_date = { [Op.gte]: startDate };
        returnDateFilter.return_date = { [Op.gte]: startDate };
        voucherDateFilter.issue_date = { [Op.gte]: startDate };
    } else if (endDate) {
        invoiceDateFilter.invoice_date = { [Op.lte]: endDate };
        returnDateFilter.return_date = { [Op.lte]: endDate };
        voucherDateFilter.issue_date = { [Op.lte]: endDate };
    }

    // Active status filters
    invoiceDateFilter.invoice_type = 'normal';
    invoiceDateFilter.invoice_status = { [Op.notIn]: ['cancelled', 'draft'] };
    returnDateFilter.status = { [Op.ne]: 'cancelled' };
    voucherDateFilter.status = { [Op.in]: ['approved', 'posted'] };

    // 2. Fetch Sales Invoices
    const invoices = await SalesInvoice.findAll({
        where: invoiceDateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name', 'city_id'],
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'name', 'governate_id'],
                    include: [{
                        model: Governate,
                        as: 'governate',
                        attributes: ['id', 'name']
                    }]
                }]
            }
        ]
    });

    // 3. Fetch Sales Returns
    const returns = await SalesReturn.findAll({
        where: returnDateFilter,
        include: [
            {
                model: Party,
                as: 'customer',
                attributes: ['id', 'name', 'city_id'],
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'name', 'governate_id'],
                    include: [{
                        model: Governate,
                        as: 'governate',
                        attributes: ['id', 'name']
                    }]
                }]
            }
        ]
    });

    // 4. Fetch Issue Vouchers
    const vouchers = await IssueVoucher.findAll({
        where: voucherDateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name', 'city_id'],
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'name', 'governate_id'],
                    include: [{
                        model: Governate,
                        as: 'governate',
                        attributes: ['id', 'name']
                    }]
                }]
            }
        ]
    });

    // Helper to check if Customer/Party is in a different region
    const isDifferentRegion = (party) => {
        if (!party) return false;
        
        const partyCityId = party.city_id;
        const partyGovernateId = party.city?.governate_id;

        // If we have governorates for both, compare governorates
        if (warehouseGovernateId && partyGovernateId) {
            return warehouseGovernateId !== partyGovernateId;
        }

        // Fallback to cities comparison
        if (warehouseCityId && partyCityId) {
            return warehouseCityId !== partyCityId;
        }

        // If one of them has city/governate and the other doesn't, treat as different region
        if ((warehouseCityId && !partyCityId) || (!warehouseCityId && partyCityId)) {
            return true;
        }

        return false;
    };

    const results = [];

    // Process Invoices
    invoices.forEach(inv => {
        if (isDifferentRegion(inv.party)) {
            results.push({
                type: 'sales_invoice',
                typeLabel: 'فاتورة مبيعات',
                id: inv.id,
                referenceNo: inv.id.toString(),
                date: inv.invoice_date,
                partyId: inv.party?.id,
                partyName: inv.party?.name || 'غير معروف',
                partyRegion: inv.party?.city?.governate?.name 
                    ? `${inv.party.city.governate.name} - ${inv.party.city.name}`
                    : (inv.party?.city?.name || 'غير محدد'),
                warehouseName: warehouse.name,
                warehouseRegion: warehouse.city?.governate?.name
                    ? `${warehouse.city.governate.name} - ${warehouse.city.name}`
                    : (warehouse.city?.name || 'غير محدد'),
                amount: parseFloat(inv.total_amount || 0),
                notes: inv.notes || ''
            });
        }
    });

    // Process Returns
    returns.forEach(ret => {
        if (isDifferentRegion(ret.customer)) {
            results.push({
                type: 'sales_return',
                typeLabel: 'مرتجع مبيعات',
                id: ret.id,
                referenceNo: ret.id.toString(),
                date: ret.return_date,
                partyId: ret.customer?.id,
                partyName: ret.customer?.name || 'غير معروف',
                partyRegion: ret.customer?.city?.governate?.name 
                    ? `${ret.customer.city.governate.name} - ${ret.customer.city.name}`
                    : (ret.customer?.city?.name || 'غير محدد'),
                warehouseName: warehouse.name,
                warehouseRegion: warehouse.city?.governate?.name
                    ? `${warehouse.city.governate.name} - ${warehouse.city.name}`
                    : (warehouse.city?.name || 'غير محدد'),
                amount: -parseFloat(ret.total_amount || 0), // Negative amount for returns
                notes: ret.notes || ''
            });
        }
    });

    // Process Issue Vouchers
    vouchers.forEach(v => {
        if (isDifferentRegion(v.party)) {
            results.push({
                type: 'issue_voucher',
                typeLabel: 'إذن صرف مخزني',
                id: v.id,
                referenceNo: v.voucher_no,
                date: v.issue_date,
                partyId: v.party?.id,
                partyName: v.party?.name || 'غير معروف',
                partyRegion: v.party?.city?.governate?.name 
                    ? `${v.party.city.governate.name} - ${v.party.city.name}`
                    : (v.party?.city?.name || 'غير محدد'),
                warehouseName: warehouse.name,
                warehouseRegion: warehouse.city?.governate?.name
                    ? `${warehouse.city.governate.name} - ${warehouse.city.name}`
                    : (warehouse.city?.name || 'غير محدد'),
                amount: null, // Issue vouchers don't have total financial amount, only inventory cost
                notes: v.note || ''
            });
        }
    });

    // Sort results by date descending
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
        warehouse: {
            id: warehouse.id,
            name: warehouse.name,
            region: warehouse.city?.governate?.name
                ? `${warehouse.city.governate.name} - ${warehouse.city.name}`
                : (warehouse.city?.name || 'غير محدد')
        },
        transactions: results
    };
};

export default {
    getCrossRegionReport
};
