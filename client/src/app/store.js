import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "../features/units/unitsSlice";
import productsReducer from "../features/products/productsSlice";
import countriesReducer from "../features/countries/countriesSlice";
import governatesReducer from  '../features/governates/governatesSlice';
import citiesReducer from '../features/cities/citiesSlice';
import warehousesReducer from "../features/warehouses/warehousesSlice";
import accountsReducer from "../features/accounts/accountsSlice";
import PartyCategoriesreducer from "../features/partyCategories/partyCategoriesSlice";
import PartiesReducer from "../features/parties/partiesSlice"
import PurchaseOrdersreducer from "../features/purchaseOrders/purchaseOrdersSlice"
import purchaseOrderItemsReducer from '../features/purchaseOrderItems/purchaseOrderItemsSlice'


export const store = configureStore({
  reducer: {
    units: unitsReducer,
    products: productsReducer,
    countries: countriesReducer,
    governates: governatesReducer,
    cities:   citiesReducer,
    warehouses: warehousesReducer,
    accounts: accountsReducer,
    partyCategories: PartyCategoriesreducer,
    parties:PartiesReducer,
    purchaseOrders:PurchaseOrdersreducer,
    purchaseOrderItems: purchaseOrderItemsReducer,


  },
});