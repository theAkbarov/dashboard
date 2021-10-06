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

const ParentalInfoPage = () => {
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
  const [category, setCategory] = useState(queryParams?.values?.category || "");

  const cache = useQueryCache();
  const parentalInfoList = usePaginatedQuery(
    ["parentalInfoList", state.page, category],
    () =>
      requests.parental.info.getAll({
        category,
        page: queryParams.values.page,
      }),
    { enabled: category }
  );

  const parentalInfoCatList = usePaginatedQuery(
    ["parentalInfoCategoryList", state.page],
    () =>
      requests.category.parental.info.getAll({
        ...queryParams.values,
        page: queryParams.values.page,
      })
  );

  const [deleteParental, deleteParentalInfo] = useMutation(
    requests.parental.info.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("parentalInfoList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("parentalInfoList");
      },
    }
  );

  return (
    <Spin spinning={parentalInfoList.isLoading || parentalInfoList.isFetching}>
      <MainTitle
        title={t("sidebar.parental_info")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/parental-info/create");
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
              deleteParental(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteParentalInfo && deleteParentalInfo.isLoading}
            loading={deleteParentalInfo && deleteParentalInfo.isLoading}
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
        <Select
          defaultValue={category}
          style={{ width: 300, marginBottom: 20 }}
          placeholder={t("sidebar.categories")}
          loading={parentalInfoCatList.isLoading}
          onChange={(val) => {
            setCategory(val);
            queryParams.set("category", val);
            cache.invalidateQueries(["parentalInfoList", state.page]);
          }}
        >
          {_.get(parentalInfoCatList, ["data", "data", "results"])
            ? _.get(parentalInfoCatList, ["data", "data", "results"]).map(
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
            total: _.get(parentalInfoList, ["data", "data", "count"]),
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
                  _.get(parentalInfoList, ["data", "data", "count"])
                ),
            },
            {
              title: t("form.thumbnail"),
              dataIndex: "thumbnail",
              render: (thumbnail) => (
                <div style={{ height: "5rem", width: "5rem" }}>
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      margin: "0 auto",
                    }}
                  />
                </div>
              ),
            },
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
                      history.push(`parental-info/${record.guid}`);
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
          dataSource={_.get(parentalInfoList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default ParentalInfoPage;
