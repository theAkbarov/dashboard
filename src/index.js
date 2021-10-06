import React from "react";
import ReactDOM from "react-dom";

import { QueryCache, ReactQueryCacheProvider } from "react-query";

import App from "./App";
import i18n from "services/i18n";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { store } from "Store";
import api from "services/api";

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      // refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

api.subscribe(store);

ReactDOM.render(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  </ReactQueryCacheProvider>,
  document.getElementById("root")
);
