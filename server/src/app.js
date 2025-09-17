import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import unitRoutes from './routes/unit.routes.js';
import countryRoutes from './routes/country.routes.js';
import governateRoutes from './routes/governate.routes.js';
import cityRoutes from './routes/city.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';
import accountRoutes from './routes/account.routes.js';
import purchaseOrderRoutes from './routes/purchaseOrder.routes.js';
import partyCategoryRoutes from './routes/partyCategory.routes.js';
import partyRoutes from './routes/party.routes.js';
import purchaseOrderItemRoutes from "./routes/purchaseOrderItem.routes.js";
import purchaseInvoiceRoutes from './routes/purchaseInvoices.routes.js';
import purchaseInvoiceItemRoutes from './routes/purchaseInvoiceItem.routes.js';
import inventoryTransactionRoutes from './routes/inventoryTransaction.routes.js';
import journalEntryLinesRouter from "./routes/journalEntryLine.routes.js";
import paymentRoutes from "./routes/purchasePayment.routes.js";
import chequeRoutes from "./routes/supplierCheque.routes.js";


const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/products', productRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/governates', governateRoutes);
app.use('/api/cities', cityRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/party-categories", partyCategoryRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/purchase-order-items", purchaseOrderItemRoutes);
app.use("/api/purchase-invoices", purchaseInvoiceRoutes);
app.use("/api/purchase-invoice-items", purchaseInvoiceItemRoutes);
app.use("/api/inventory-transactions", inventoryTransactionRoutes);
app.use("/api/journal-entry-lines", journalEntryLinesRouter);
app.use("/api/purchase-payments", paymentRoutes);
app.use("/api/supplier-cheques", chequeRoutes);
app.use(errorHandler);
export default app;