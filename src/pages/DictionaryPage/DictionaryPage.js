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
import { isNormalInteger } from "utils/isNormalInteger";

const DictionaryPage = () => {
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
  const dictionaryList = usePaginatedQuery(["dictionaryList", state.page], () =>
    requests.dictionary.getAll({
      page: queryParams.values.page,
    })
  );

  const [deleteFaq, deleteFaqInfo] = useMutation(requests.dictionary.delete, {
    onSuccess: () => {
      notification.success({
        message: t("notification.success.delete"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("dictionaryList");
    },
    onError: () => {
      notification.error({
        message: t("notification.error.general"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("dictionaryList");
    },
  });

  return (
    <Spin spinning={dictionaryList.isLoading || dictionaryList.isFetching}>
      <MainTitle
        title={t("sidebar.dictionary")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/dictionary/create");
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
            total: _.get(dictionaryList, ["data", "data", "count"]),
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
            { title: t("form.word"), dataIndex: "word" },
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
                      history.push(`/dictionary/${record.guid}`);
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
          dataSource={_.get(dictionaryList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default DictionaryPage;
