import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import {
  UnorderedListOutlined,
  DribbbleSquareOutlined,
  QuestionOutlined,
  WechatOutlined,
  FileImageOutlined,
  UserOutlined,
  BankOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  PicCenterOutlined,
  RocketOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import withLink from "containers/HOC/withLink";
import { useTranslation } from "react-i18next";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const renderMenuItem = (route, key, empty = false, icon) => {
  const { path, name } = route;

  const children = (
    <React.Fragment {...{ key }}>
      <span>{name}</span>
    </React.Fragment>
  );

  if (empty) return children;

  return (
    <Menu.Item icon={icon} {...{ key }}>
      {withLink(path)(children)}
    </Menu.Item>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const items = [
    {
      name: t("sidebar.banner"),
      path: "/banner",
      icon: <PicCenterOutlined />,
    },
    {
      name: t("sidebar.categories"),
      path: "/categories",
      icon: <UnorderedListOutlined />,
    },
    {
      name: t("sidebar.videoblog"),
      path: "/videoblog",
      icon: <PlayCircleOutlined />,
    },
    {
      name: t("sidebar.infographics"),
      path: "/infographics",
      icon: <FileImageOutlined />,
    },
    {
      name: t("sidebar.faq"),
      path: "/faq",
      icon: <QuestionOutlined />,
    },
    {
      name: t("sidebar.feedback"),
      path: "/feedback",
      icon: <WechatOutlined />,
    },
    {
      name: t("sidebar.sportsmen"),
      path: "/sportsman",
      icon: <UserOutlined />,
    },
    {
      name: t("sidebar.facilities"),
      path: "/facilities",
      icon: <BankOutlined />,
    },
    {
      name: t("sidebar.sport_club"),
      path: "/club",
      icon: <DribbbleSquareOutlined />,
    },
    {
      name: t("sidebar.applications"),
      path: "/applications",
      icon: <FileTextOutlined />,
    },
    {
      name: t("sidebar.dictionary"),
      path: "/dictionary",
      icon: <BookOutlined />,
    },
    {
      name: t("sidebar.parental_faq"),
      path: "/parental-faq",
      icon: <UsergroupAddOutlined />,
    },
    {
      name: t("sidebar.parental_info"),
      path: "/parental-info",
      icon: <UsergroupDeleteOutlined />,
    },
    {
      name: t("sidebar.users"),
      path: "/users",
      icon: <UserOutlined />,
    },
    {
      name: t("sidebar.about_us"),
      path: "/about",
      icon: <InfoCircleOutlined />,
    },
    {
      name: t("sidebar.tips"),
      path: "/tips",
      icon: <BulbOutlined />,
    },
    {
      name: t("sidebar.games"),
      path: "/games",
      icon: <RocketOutlined />,
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="logo-container">
        {/*<img src={logo} alt="Logo"/>*/}
        {t("global.admin")}
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
        {items.map((route) => {
          if (!route.name) return null;

          return renderMenuItem(route, route.path, false, route.icon);
        })}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
