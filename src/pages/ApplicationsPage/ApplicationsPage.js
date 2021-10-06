import React, { useState } from "react";
import MainTitle from "components/MainTitle";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import AnonUser from "pages/ApplicationsPage/AnonUser";
import AuthUser from "pages/ApplicationsPage/AuthUsers";

const { TabPane } = Tabs;

const ApplicationsPage = () => {
  const { t } = useTranslation();
  const queryParams = useQueryParams();
  const [activeTab, setActiveTab] = useState(
    (queryParams.values && queryParams.values.activeTab) || "anon"
  );

  return (
    <MainTitle title={t("sidebar.applications")}>
      <Tabs
        onChange={(key) => {
          queryParams.merge({
            activeTab: key,
            page: 1,
          });
          setActiveTab(key);
        }}
        activeKey={activeTab}
      >
        <TabPane tab={t("categories.anon_users")} key="anon">
          <AnonUser />
        </TabPane>
        <TabPane tab={t("categories.auth_users")} key="auth">
          <AuthUser />
        </TabPane>
      </Tabs>
    </MainTitle>
  );
};

export default ApplicationsPage;
