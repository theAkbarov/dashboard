import "antd/dist/antd.css";
import "assets/sass/main.scss";

import { useTranslation } from "react-i18next";
import { PersistGate } from "redux-persist/integration/react";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "routes/routes";
import { persistor } from "Store";
import { useSelector } from "react-redux";

function App() {
  const { i18n } = useTranslation();
  const { language } = useSelector((state) => ({
    language: state.system.language,
  }));

  useEffect(() => {
    language && i18n.changeLanguage(language);
  }, [language]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </PersistGate>
  );
}

export default App;
