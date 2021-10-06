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
import useModal from "hooks/useModal";
import CustomModal from "components/CustomModal";
import useQueryParams from "hooks/useQueryParams";
import { requests } from "services/requests";
import { getRowNum } from "utils/getRowNum";

const ParentalInfoCategory = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  let history = useHistory();
  const modal = useModal();
  const [state, setState] = useState({
    page: queryParams.values && queryParams.values.page,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const parentalInfoCatList = usePaginatedQuery(
    ["parentalInfoCategoryList", state.page],
    () =>
      requests.category.parental.info.getAll({
        ...queryParams.values,
        page: queryParams.values.page,
      })
  );

  const [deleteInfographics, deleteInfographicsInfo] = useMutation(
    requests.category.parental.info.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("parentalInfoCategoryList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("parentalInfoCategoryList");
      },
    }
  );

  return (
    <Spin
      spinning={parentalInfoCatList.isLoading || parentalInfoCatList.isFetching}
    >
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
          pagination={false}
          columns={[
            {
              title: "No",
              key: "index",
              render: (text, record, index) =>
                getRowNum(
                  index,
                  1,
                  parentalInfoCatList?.data?.data?.results?.length,
                  1000
                ),
            },
            {
              title: t("form.image"),
              dataIndex: "image",
              render: (image) => (
                <div style={{ height: "5rem", width: "5rem" }}>
                  <img
                    src={image}
                    alt="image"
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
                      history.push(`categories/parental-info/${record.guid}`);
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
          dataSource={_.get(parentalInfoCatList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default ParentalInfoCategory;
