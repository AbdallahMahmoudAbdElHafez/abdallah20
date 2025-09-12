

import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme.js";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* بيظبط الـ reset للـ CSS */}
        <App />
      </ThemeProvider>
      </CacheProvider>
    </Provider>

  </React.StrictMode>
);




