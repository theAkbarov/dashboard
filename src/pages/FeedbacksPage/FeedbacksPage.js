import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Table, Space, notification, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseSquareOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import moment from "moment";
import _ from "lodash";

import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import useModal from "hooks/useModal";
import CustomModal from "components/CustomModal";
import useQueryParams from "hooks/useQueryParams";
import { requests } from "services/requests";
import { isNormalInteger } from "utils/isNormalInteger";
import feedbacks from "services/requests/feedbacks";
import { getRowNum } from "utils/getRowNum";

const FeedbacksPage = () => {
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
  const feedbackList = usePaginatedQuery(["feedbackList", state.page], () =>
    requests.feedbacks.getAll({
      page: queryParams.values.page,
    })
  );

  const [deleteFeedbacks, deleteFeedbacksInfo] = useMutation(
    requests.feedbacks.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("feedbacksList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("feedbacksList");
      },
    }
  );

  return (
    <Spin spinning={feedbackList.isLoading || feedbackList.isFetching}>
      <MainTitle title={t("sidebar.feedback")} />
      <CustomModal
        title={t("action.delete")}
        onCancel={() => modal.close()}
        visible={modal.isActive}
        footer={
          <Button
            danger
            onClick={() => {
              deleteFeedbacks(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteFeedbacksInfo && deleteFeedbacksInfo.isLoading}
            loading={deleteFeedbacksInfo && deleteFeedbacksInfo.isLoading}
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
            total: _.get(feedbackList, ["data", "data", "count"]),
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
                  _.get(feedbackList, ["data", "data", "count"])
                ),
            },
            {
              title: t("form.created_date"),
              dataIndex: "created_date",
              render: (created_date) =>
                moment(created_date).format("DD.MM.YYYY"),
            },
            { title: t("form.full_name"), dataIndex: "full_name" },
            { title: t("form.phone_number"), dataIndex: "phone_number" },
            {
              title: t("status.completed"),
              dataIndex: "is_completed",
              render: (is_completed) =>
                is_completed ? (
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
                      history.push(`/feedback/${record.guid}`);
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
          dataSource={_.get(feedbackList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default FeedbacksPage;
