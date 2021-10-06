import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Table,
  Space,
  notification,
  Switch,
  Select,
  Tabs,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
const { TabPane } = Tabs;

const ClubPage = () => {
  const queryParams = useQueryParams();
  const [activeTab, setActiveTab] = useState(
    (queryParams.values && queryParams.values.activeTab) || "sport"
  );

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
  const sportClubList = usePaginatedQuery(
    ["clubList", state.page, category],
    () =>
      requests.club.getAll(
        {
          page: queryParams.values.page,
        },
        category
      ),
    { enabled: category }
  );

  const [deleteClub, deleteClubInfo] = useMutation(requests.club.delete, {
    onSuccess: () => {
      notification.success({
        message: t("notification.success.delete"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("clubList");
    },
    onError: () => {
      notification.error({
        message: t("notification.error.general"),
        placement: "topRight",
      });
      modal.close();
      cache.invalidateQueries("clubList");
    },
  });

  const facilityList = usePaginatedQuery(
    ["facilityList", state.page, category],
    () => requests.facility.getAllList()
  );

  return (
    <Spin spinning={sportClubList.isLoading || sportClubList.isFetching}>
      <MainTitle
        title={t("sidebar.sport_club")}
        button={t("action.add")}
        onButtonClick={() => {
          history.push("/club/create");
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
              deleteClub(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteClubInfo && deleteClubInfo.isLoading}
            loading={deleteClubInfo && deleteClubInfo.isLoading}
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
          placeholder={t("sidebar.facilities")}
          loading={facilityList.isLoading}
          onChange={(val) => {
            setCategory(val);
            queryParams.set("category", val);
          }}
        >
          {_.get(facilityList, ["data", "data", "results"])
            ? _.get(facilityList, ["data", "data", "results"]).map(
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
            total: _.get(sportClubList, ["data", "data", "count"]),
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
                  _.get(sportClubList, ["data", "data", "count"])
                ),
            },
            { title: t("form.title"), dataIndex: "title", ellipsis: true },
            {
              title: t("form.child_age_from"),
              dataIndex: "child_age_from",
              ellipsis: true,
            },
            {
              title: t("form.child_age_to"),
              dataIndex: "child_age_to",
              ellipsis: true,
            },
            {
              title: t("form.club_hour_from"),
              dataIndex: "club_hour_from",
              ellipsis: true,
            },
            {
              title: t("form.club_hour_to"),
              dataIndex: "club_hour_to",
              ellipsis: true,
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
                      history.push(`club/${record.guid}`);
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
          dataSource={_.get(sportClubList, ["data", "data", "results"])}
        />
      </Card>
    </Spin>
  );
};

export default ClubPage;
