import React, { useState } from "react";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useModal from "hooks/useModal";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import { Button, Card, Divider, notification, Radio, Space, Table } from "antd";
import Spin from "components/Spin";
import CustomModal from "components/CustomModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { getRowNum } from "utils/getRowNum";

const AuthUsers = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  const statusModal = useModal();
  const [state, setState] = useState({
    page: queryParams?.values?.page,
    editingItem: null,
    status: null,
  });

  const cache = useQueryCache();
  const anonUserList = usePaginatedQuery(
    ["authUsers", queryParams?.values?.page],
    () =>
      requests.club.user.auth.getAll({
        page: queryParams.values.page,
      })
  );

  const options = [
    { label: t("status.pending"), value: "pending" },
    { label: t("status.approved"), value: "approved" },
    { label: t("status.denied"), value: "denied" },
  ];

  const renderStatusText = (status) => {
    switch (status) {
      case "denied":
        return t("status.denied");
      case "approved":
        return t("status.approved");
      case "pending":
        return t("status.pending");
      default:
        return t("status.pending");
    }
  };

  const [changeStatus, changeStatusInfo] = useMutation(
    requests.club.user.auth.changeStatus,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.update"),
          placement: "topRight",
        });
        statusModal.close();
        cache.invalidateQueries("authUsers");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        statusModal.close();
        cache.invalidateQueries("authUsers");
      },
    }
  );

  return (
    <Spin spinning={anonUserList.isLoading || anonUserList.isFetching}>
      <Card>
        <Table
          rowKey="guid"
          size="middle"
          style={{ overflowX: "scroll" }}
          ellipsis
          columns={[
            {
              title: "No",
              key: "index",
              render: (text, record, index) =>
                getRowNum(
                  index,
                  queryParams.values.page,
                  _.get(anonUserList, ["data", "data", "count"])
                ),
            },
            { title: t("form.first_name"), dataIndex: "first_name" },
            { title: t("form.last_name"), dataIndex: "last_name" },
            { title: t("form.email"), dataIndex: "email" },
            { title: t("form.phone_number"), dataIndex: "phone_number" },
            {
              title: t("form.gender"),
              dataIndex: "gender",
              render: (gender) =>
                gender === "MALE" ? t("gender.male") : t("gender.female"),
            },
            {
              title: t("form.date_of_birth"),
              dataIndex: "date_of_birth",
              render: (date_of_birth) =>
                moment(date_of_birth).format("DD.MM.YYYY"),
            },
            {
              title: t("form.sport_club_title"),
              dataIndex: "sport_club_title",
            },
            { title: t("form.facility_title"), dataIndex: "facility_title" },
            {
              title: t("form.created_date"),
              dataIndex: "created_date",
              render: (created_date) =>
                moment(created_date).format("DD.MM.YYYY"),
            },
            {
              title: t("form.status"),
              dataIndex: "status",
              render: (status) => renderStatusText(status),
            },
            {
              title: t("action.action"),
              fixed: "right",
              width: 50,
              render: (_, record) => (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setState({
                      ...state,
                      editingItem: record,
                      status: record?.status,
                    });
                    statusModal.open();
                  }}
                />
              ),
            },
          ]}
          dataSource={anonUserList?.data?.data?.results}
          pagination={{
            size: "middle",
            total: anonUserList?.data?.data?.count,
            defaultCurrent: parseInt(queryParams?.values?.page) || 1,
            pageSize: state.limit,
            current: parseInt(queryParams?.values?.page),
            onChange: (page) => {
              window.scrollTo(0, 0);
              setState({
                ...state,
                page,
              });
              queryParams.merge({
                page,
              });
            },
          }}
        />
      </Card>
      <CustomModal
        title={t("form.status")}
        onCancel={() => statusModal.close()}
        visible={statusModal.isActive}
        footer={null}
      >
        <Radio.Group
          options={options}
          onChange={(e) =>
            setState({
              ...state,
              status: e.target.value,
            })
          }
          value={state.status}
          buttonStyle="solid"
          optionType="button"
        />
        <Divider />
        <Button
          type="primary"
          loading={changeStatusInfo.isLoading}
          htmlType="submit"
          className="login-form-button"
          onClick={() => {
            changeStatus({
              status: state.status,
              id: state.editingItem?.guid,
            });
          }}
        >
          {t("action.save")}
        </Button>
      </CustomModal>
    </Spin>
  );
};

export default AuthUsers;
