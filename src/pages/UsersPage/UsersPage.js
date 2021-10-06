import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Table, notification, Switch, Space, Button } from "antd";
import { useHistory } from "react-router-dom";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import _ from "lodash";
import moment from "moment";

import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import useModal from "hooks/useModal";
import useQueryParams from "hooks/useQueryParams";
import { requests } from "services/requests";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getRowNum } from "utils/getRowNum";

const UsersPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  let history = useHistory();
  const modal = useModal();
  const [staffId, setStaffId] = useState("");
  const [state, setState] = useState({
    page: queryParams.values && queryParams.values.page,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const userList = usePaginatedQuery(["userList", state.page], () =>
    requests.user.getAll({
      page: queryParams.values.page,
    })
  );

  const [toggleStaff, toggleStaffInfo] = useMutation(
    requests.user.toggleStaff,
    {
      onSuccess: (data) => {
        notification.success({
          message: t("notification.success.general"),
          placement: "topRight",
        });
        // modal.close();
        setStaffId(null);
        cache.invalidateQueries("userList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        setStaffId(null);
        cache.invalidateQueries("userList");
      },
    }
  );

  return (
    <Spin spinning={userList.isLoading}>
      <MainTitle title={t("sidebar.users")} />
      <Card>
        <Table
          rowKey="guid"
          size="middle"
          style={{ overflowX: "scroll" }}
          ellipsis
          pagination={{
            size: "middle",
            total: _.get(userList, ["data", "data", "count"]),
            defaultCurrent: parseInt(state.page) || 1,
            pageSize: state.limit,
            current: parseInt(state.page),
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
          columns={[
            {
              title: "No",
              key: "index",
              render: (text, record, index) =>
                getRowNum(
                  index,
                  queryParams.values.page,
                  _.get(userList, ["data", "data", "count"])
                ),
            },
            { title: t("form.first_name"), dataIndex: "first_name" },
            { title: t("form.last_name"), dataIndex: "last_name" },
            {
              title: t("form.gender"),
              dataIndex: "gender",
              render: (gender) =>
                gender === "MALE" ? t("gender.male") : t("gender.female"),
            },
            {
              title: t("form.is_staff"),
              dataIndex: "user.is_staff",
              render: (_, record) => (
                <Switch
                  checked={record && record.is_staff}
                  onChange={(checked) => {
                    setStaffId(record.guid);
                    toggleStaff({ id: record && record.guid, status: checked });
                  }}
                  disabled={staffId === record.guid}
                />
              ),
            },
            {
              title: "",
              fixed: "right",
              width: 100,
              render: (_, record) => (
                <Space>
                  <Button
                    type="link"
                    icon={<InfoCircleOutlined />}
                    onClick={() => {
                      history.push(`/users/${record.guid}`);
                    }}
                  />
                </Space>
              ),
            },
          ]}
          dataSource={_.get(userList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default UsersPage;
