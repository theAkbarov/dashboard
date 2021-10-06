import React, { useState } from "react";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import useModal from "hooks/useModal";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import { Button, Card, notification, Space, Table } from "antd";
import Spin from "components/Spin";
import CustomModal from "components/CustomModal";
import {
  CheckCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import MainTitle from "components/MainTitle";
import { useHistory } from "react-router-dom";
import { isNormalInteger } from "utils/isNormalInteger";
import { getRowNum } from "utils/getRowNum";

const BannerPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  const modal = useModal();
  let history = useHistory();
  const [state, setState] = useState({
    page: isNormalInteger(queryParams?.values?.page)
      ? queryParams.values.page
      : 1,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const bannerList = usePaginatedQuery(["bannerList", state.page], () =>
    requests.banner.getAll({
      page: queryParams.values.page,
    })
  );

  const [deleteBanner, deleteBannerInfo] = useMutation(requests.banner.delete, {
    onSuccess: () => {
      notification.success({
        message: t("notification.success.delete"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("bannerList");
    },
    onError: () => {
      notification.error({
        message: t("notification.error.general"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("bannerList");
    },
  });

  return (
    <Spin spinning={bannerList.isLoading || bannerList.isFetching}>
      <MainTitle
        title={t("sidebar.banner")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/banner/create");
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
              deleteBanner(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteBannerInfo && deleteBannerInfo.isLoading}
            loading={deleteBannerInfo && deleteBannerInfo.isLoading}
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
            total: bannerList?.data?.data?.count,
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
                  _.get(bannerList, ["data", "data", "count"])
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
                      history.push(`/banner/${record.guid}`);
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
          dataSource={bannerList?.data?.data?.results}
        />
      </Card>
    </Spin>
  );
};

export default BannerPage;
