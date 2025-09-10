const unitRoutes = require("./unit.routes");
const productRoutes = require("./product.route");
const countryRoutes = require("./country.routes");
const governateRoutes = require("./governate.routes");
const cityRoutes = require("./city.route");
const warehouseRoutes = require("./warehouse.routes");

router.use("/units", unitRoutes);
router.use("/products", productRoutes);
router.use("/countries", countryRoutes);
router.use("/governates", governateRoutes);
router.use("/cities", cityRoutes);
router.use("/warehouses", warehouseRoutes);
