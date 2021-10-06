import React, { Fragment, useState } from "react";
import { Tabs } from "antd";
import MainTitle from "components/MainTitle";
import { useTranslation } from "react-i18next";
import useQueryParams from "hooks/useQueryParams";
import { useHistory } from "react-router-dom";
import VideoBlogCategoryPage from "pages/CategoriesPage/VideoBlogCategoryPage";
import FacilityCategoryPage from "pages/CategoriesPage/FacilityCategoryPage";
import SportCategoryPage from "pages/CategoriesPage/SportCategoryPage";
import ParentalFaqCategory from "pages/CategoriesPage/ParentalFaqCategory";
import ParentalInfoCategory from "pages/CategoriesPage/ParentalInfoCategory";

const { TabPane } = Tabs;

const CategoriesPage = () => {
  const { t } = useTranslation();
  let history = useHistory();
  const queryParams = useQueryParams();
  const [activeTab, setActiveTab] = useState(
    (queryParams.values && queryParams.values.activeTab) || "sport"
  );

  return (
    <MainTitle
      button={t("action.add")}
      onButtonClick={() => {
        history.push(`/categories/${activeTab}/create`);
      }}
      title={t("sidebar.categories")}
    >
      <Tabs
        onChange={(key) => {
          queryParams.set("activeTab", key);
          setActiveTab(key);
        }}
        activeKey={activeTab}
      >
        <TabPane tab={t("categories.sport")} key="sport">
          <SportCategoryPage />
        </TabPane>
        <TabPane tab={t("categories.videoblog")} key="videoblog">
          <VideoBlogCategoryPage />
        </TabPane>
        <TabPane tab={t("categories.facility")} key="facility">
          <FacilityCategoryPage />
        </TabPane>
        <TabPane tab={t("categories.parental_faq")} key="parental-faq">
          <ParentalFaqCategory />
        </TabPane>
        <TabPane tab={t("categories.parental_info")} key="parental-info">
          <ParentalInfoCategory />
        </TabPane>
      </Tabs>
    </MainTitle>
  );
};

export default CategoriesPage;
