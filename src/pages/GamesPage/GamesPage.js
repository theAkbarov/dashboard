import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import MainTitle from "components/MainTitle";
import { Tabs } from "antd";
import SportCategoryPage from "pages/CategoriesPage/SportCategoryPage";
import VideoBlogCategoryPage from "pages/CategoriesPage/VideoBlogCategoryPage";
import QuestionsPage from "pages/GamesPage/QuestionsPage";

const { TabPane } = Tabs;

const GamesPage = () => {
  const { t } = useTranslation();
  let history = useHistory();
  const queryParams = useQueryParams();
  const [activeTab, setActiveTab] = useState(
    (queryParams.values && queryParams.values.activeTab) || "question"
  );

  return (
    <MainTitle
      button={t("action.add")}
      onButtonClick={() => {
        history.push(`/games/${activeTab}/create`);
      }}
      title={t("form.question")}
    >
      <QuestionsPage />
    </MainTitle>
  );
};

export default GamesPage;
