import React, { useState } from "react";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import useModal from "hooks/useModal";
import { useHistory } from "react-router-dom";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import { Button, Card, notification, Space, Table } from "antd";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import CustomModal from "components/CustomModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import _ from "lodash";
import { isNormalInteger } from "utils/isNormalInteger";
import { getRowNum } from "utils/getRowNum";

const TipsPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  const modal = useModal();
  let history = useHistory();
  const [state, setState] = useState({
    page: isNormalInteger(_.get(queryParams, ["values", "page"]))
      ? queryParams.values.page
      : 1,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const tipList = usePaginatedQuery(["tipList", state.page], () =>
    requests.tip.getAll({
      page: queryParams.values.page,
    })
  );

  const [deleteTip, deleteTipInfo] = useMutation(requests.tip.delete, {
    onSuccess: () => {
      notification.success({
        message: t("notification.success.delete"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("tipList");
    },
    onError: () => {
      notification.error({
        message: t("notification.error.general"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("tipList");
    },
  });

  return (
    <Spin spinning={tipList.isLoading || tipList.isFetching}>
      <MainTitle
        title={t("sidebar.tips")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/tips/create");
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
              deleteTip(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteTipInfo && deleteTipInfo.isLoading}
            loading={deleteTipInfo && deleteTipInfo.isLoading}
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
            total: _.get(tipList, ["data", "data", "count"]),
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
                  _.get(tipList, ["data", "data", "count"])
                ),
            },
            { title: t("form.title"), dataIndex: "title" },
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
                      history.push(`/tips/${record.guid}`);
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
          dataSource={_.get(tipList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default TipsPage;
