import React from "react";
import { Link } from "react-router-dom";

import { Card, Alert } from "antd";
import LoginForm from "pages/LoginPage/form/LoginForm";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <div className="login-page">
      <Card>
        <div className="login-page__top">
          <div className="login-page__header">
            <Link to="/">
              {/*<Logo className="login-page__logo" />*/}
              <span className="login-page__title">Kids Sport</span>
            </Link>
          </div>
          <div className="login-page__desc">{t("global.welcome")}</div>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
