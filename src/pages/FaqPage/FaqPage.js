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
import moment from "moment";
import _ from "lodash";

import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import useModal from "hooks/useModal";
import CustomModal from "components/CustomModal";
import useQueryParams from "hooks/useQueryParams";
import { requests } from "services/requests";
import faq from "services/requests/faq";
import { isNormalInteger } from "utils/isNormalInteger";
import { getRowNum } from "utils/getRowNum";

const FaqPage = () => {
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
  const faqList = usePaginatedQuery(["faqList", state.page], () =>
    requests.faq.getAll({
      page: queryParams.values.page,
    })
  );

  const [deleteFaq, deleteFaqInfo] = useMutation(requests.faq.delete, {
    onSuccess: () => {
      notification.success({
        message: t("notification.success.delete"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("faqList");
    },
    onError: () => {
      notification.error({
        message: t("notification.error.general"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("faqList");
    },
  });

  return (
    <Spin spinning={faqList.isLoading || faqList.isFetching}>
      <MainTitle
        title={t("sidebar.faq")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/faq/create");
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
              deleteFaq(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteFaqInfo && deleteFaqInfo.isLoading}
            loading={deleteFaqInfo && deleteFaqInfo.isLoading}
            type="primary"
          >
            {t("action.delete")}
          </Button>
        }
      >
        {t("question.deleting")}
        <br />
        <b>{state.selectedItem && state.selectedItem.question}</b>
      </CustomModal>
      <Card>
        <Table
          rowKey="guid"
          size="middle"
          style={{ overflowX: "scroll" }}
          ellipsis
          pagination={{
            size: "middle",
            total: _.get(faqList, ["data", "data", "count"]),
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
                  _.get(faqList, ["data", "data", "count"])
                ),
            },
            { title: t("form.title"), dataIndex: "question" },
            // {
            //   title: t("form.visibility"),
            //   dataIndex: "visibility",
            //   render: (visibility) => (
            //     <Switch checked={visibility} onChange={() => {}} />
            //   ),
            // },
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
                      history.push(`/faq/${record.guid}`);
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
          dataSource={_.get(faqList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default FaqPage;
