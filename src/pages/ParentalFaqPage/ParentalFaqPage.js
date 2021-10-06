import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Table, Space, notification, Switch, Select } from "antd";
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
import { getRowNum } from "utils/getRowNum";

const { Option } = Select;

const ParentalFaqPage = () => {
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
  const [category, setCategory] = useState(
    queryParams.values && queryParams.values.category
  );

  const cache = useQueryCache();
  const parentalFaqList = usePaginatedQuery(
    ["parentalFaqList", state.page, category],
    () =>
      requests.parental.faq.getAll({
        category,
        page: queryParams.values.page,
      }),
    { enabled: category }
  );

  const parentalFaqCatList = usePaginatedQuery(
    ["parentalFaqCategoryList", state.page],
    () =>
      requests.category.parental.faq.getAll({
        ...queryParams.values,
        page: queryParams.values.page,
      })
  );

  const [deleteParentalFaq, deleteParentalFaqInfo] = useMutation(
    requests.parental.faq.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("parentalFaqList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("parentalFaqList");
      },
    }
  );

  return (
    <Spin spinning={parentalFaqList.isLoading || parentalFaqList.isFetching}>
      <MainTitle
        title={t("sidebar.parental_faq")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/parental-faq/create");
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
              deleteParentalFaq(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteParentalFaqInfo && deleteParentalFaqInfo.isLoading}
            loading={deleteParentalFaqInfo && deleteParentalFaqInfo.isLoading}
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
        <Select
          defaultValue={category}
          style={{ width: 300, marginBottom: 20 }}
          placeholder={t("sidebar.categories")}
          loading={parentalFaqCatList.isLoading}
          onChange={(val) => {
            setCategory(val);
            queryParams.set("category", val);
          }}
        >
          {_.get(parentalFaqCatList, ["data", "data", "results"])
            ? _.get(parentalFaqCatList, ["data", "data", "results"]).map(
                (item, id) => {
                  return (
                    <Option value={item && item.guid} key={id}>
                      {item && item.title}
                    </Option>
                  );
                }
              )
            : null}
        </Select>
        <Table
          rowKey="guid"
          size="middle"
          style={{ overflowX: "scroll" }}
          ellipsis
          pagination={{
            size: "middle",
            total: _.get(parentalFaqList, ["data", "data", "count"]),
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
                  _.get(parentalFaqList, ["data", "data", "count"])
                ),
            },
            { title: t("form.title"), dataIndex: "question" },
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
                      history.push(`/parental-faq/${record.guid}`);
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
          dataSource={_.get(parentalFaqList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default ParentalFaqPage;
