import React, { useState } from "react";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import useModal from "hooks/useModal";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import { Button, Card, notification, Space, Switch, Table } from "antd";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import CustomModal from "components/CustomModal";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import _ from "lodash";
import { getRowNum } from "utils/getRowNum";

const VideoBlogCategoryPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  let history = useHistory();
  const modal = useModal();
  const [state, setState] = useState({
    page: queryParams.values && queryParams.values.page,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const videoBlogCategoryList = usePaginatedQuery(
    ["videoBlogCategoryList", state.page],
    () =>
      requests.category.videoblog.getAll({
        ...queryParams.values,
        page: queryParams.values.page,
      })
  );

  const [deleteSportCategory, deleteSportCategoryInfo] = useMutation(
    requests.category.videoblog.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("videoBlogCategoryList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("videoBlogCategoryList");
      },
    }
  );

  return (
    <Spin
      spinning={
        videoBlogCategoryList.isLoading || videoBlogCategoryList.isFetching
      }
    >
      <CustomModal
        title={t("action.delete")}
        onCancel={() => modal.close()}
        visible={modal.isActive}
        footer={
          <Button
            danger
            onClick={() => {
              deleteSportCategory(
                state.selectedItem && state.selectedItem.guid
              );
            }}
            disabled={
              deleteSportCategoryInfo && deleteSportCategoryInfo.isLoading
            }
            loading={
              deleteSportCategoryInfo && deleteSportCategoryInfo.isLoading
            }
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
                  videoBlogCategoryList?.data?.data?.length,
                  1000
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
                      history.push(`/categories/videoblog/${record.guid}`);
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
          dataSource={_.get(videoBlogCategoryList, ["data", "data"])}
        />
      </Card>
    </Spin>
  );
};

export default VideoBlogCategoryPage;
