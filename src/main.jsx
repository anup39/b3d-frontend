import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import "./i18n.js";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
