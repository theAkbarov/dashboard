import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Table, Space, notification, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import _ from "lodash";

import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import useModal from "hooks/useModal";
import CustomModal from "components/CustomModal";
import useQueryParams from "hooks/useQueryParams";
import { requests } from "services/requests";
import { isNormalInteger } from "utils/isNormalInteger";
import { getRowNum } from "utils/getRowNum";

const SportsmanPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  let history = useHistory();
  const modal = useModal();
  const [state, setState] = useState({
    page: isNormalInteger(_.get(queryParams, ["values", "page"]))
      ? queryParams.values.page
      : 1,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const sportsmanList = usePaginatedQuery(["sportsmanList", state.page], () =>
    requests.sportsman.getAll({
      page: queryParams.values.page,
    })
  );

  const [deleteInfographics, deleteInfographicsInfo] = useMutation(
    requests.sportsman.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("sportsmanList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("sportsmanList");
      },
    }
  );

  return (
    <Spin spinning={sportsmanList.isLoading || sportsmanList.isFetching}>
      <MainTitle
        title={t("sidebar.sportsmen")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/sportsman/create");
        }}
      />
      <CustomModal
        title={t("action.delete")}
        onCancel={() => modal.close()}
        visible={modal.isActive}
        footer={
          <Button
            danger
            onClick={() => {
              deleteInfographics(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={
              deleteInfographicsInfo && deleteInfographicsInfo.isLoading
            }
            loading={deleteInfographicsInfo && deleteInfographicsInfo.isLoading}
            type="primary"
          >
            {t("action.delete")}
          </Button>
        }
      >
        {t("question.deleting")}
        <br />
        <b>{state.selectedItem && state.selectedItem.title}</b>
      </CustomModal>
      <Card>
        <Table
          rowKey="guid"
          size="middle"
          style={{ overflowX: "scroll" }}
          ellipsis
          pagination={{
            size: "middle",
            total: _.get(sportsmanList, ["data", "data", "count"]),
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
                  _.get(sportsmanList, ["data", "data", "count"])
                ),
            },
            {
              title: t("form.profile_picture"),
              dataIndex: "profile_picture",
              render: (profile_picture) => (
                <div style={{ height: "5rem", width: "5rem" }}>
                  <img
                    src={profile_picture}
                    alt="profile_picture"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      margin: "0 auto",
                    }}
                  />
                </div>
              ),
            },
            { title: t("form.first_name"), dataIndex: "first_name" },
            { title: t("form.last_name"), dataIndex: "last_name" },
            { title: t("form.title"), dataIndex: "title" },
            {
              title: t("form.visibility"),
              dataIndex: "visibility",
              render: (visibility) =>
                visibility ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <CloseSquareOutlined style={{ color: "red" }} />
                ),
            },
            {
              title: t("action.actions"),
              fixed: "right",
              width: 100,
              render: (_, record) => (
                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      history.push(`sportsman/${record.guid}`);
                    }}
                  />
                  <Button
                    type="link"
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                    onClick={() => {
                      setState({
                        ...state,
                        selectedItem: record,
                      });
                      modal.open();
                    }}
                  />
                </Space>
              ),
            },
          ]}
          dataSource={_.get(sportsmanList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default SportsmanPage;
