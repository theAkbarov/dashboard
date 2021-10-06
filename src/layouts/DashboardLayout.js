import React from "react";
import { Space, Layout, Select } from "antd";
import LogoutOutlined from "@ant-design/icons/lib/icons/LogoutOutlined";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { changeLanguage, logout } from "services/actions";
import Sidebar from "components/Sidebar";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const history = useHistory();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Header
          className="site-layout-sub-header-background"
          style={{
            padding: "0 2rem",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Space direction="horizontal">
            <Select
              defaultValue={i18n.language}
              style={{ width: 80 }}
              onChange={(language) => {
                dispatch(changeLanguage(language));
                setTimeout(() => window.location.reload(), 500);
              }}
            >
              <Option value="ru">РУС</Option>
              <Option value="uz-Latn">UZB</Option>
              <Option value="en">ENG</Option>
            </Select>
            <div className="logout" onClick={() => dispatch(logout())}>
              <Space direction="horizontal">
                <LogoutOutlined color="#fff" />
                <span>{t("auth.logout")}</span>
              </Space>
            </div>
          </Space>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>PM ©2020</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
