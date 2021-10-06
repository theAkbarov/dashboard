import React, { useState } from "react";
import useQueryParams from "hooks/useQueryParams";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import useModal from "hooks/useModal";
import { useMutation, usePaginatedQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import { Button, Card, notification, Space, Table } from "antd";
import Spin from "components/Spin";
import CustomModal from "components/CustomModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AnswerModal from "pages/GamesPage/AnswerModal";
import { isNormalInteger } from "utils/isNormalInteger";
import { getRowNum } from "utils/getRowNum";

const QuestionsPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  let history = useHistory();
  const modal = useModal();
  const answerModal = useModal();
  const [state, setState] = useState({
    page: isNormalInteger(_.get(queryParams, ["values", "page"]))
      ? queryParams.values.page
      : 1,
    selectedItem: null,
  });

  const cache = useQueryCache();
  const questionList = usePaginatedQuery(["questionList", state.page], () =>
    requests.game.question.getAll({
      ...queryParams.values,
      page: queryParams.values.page,
    })
  );

  const [deleteQuestion, deleteQuestionInfo] = useMutation(
    requests.game.question.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("questionList");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        modal.close();
        cache.invalidateQueries("questionList");
      },
    }
  );

  return (
    <Spin spinning={questionList.isLoading || questionList.isFetching}>
      <AnswerModal
        close={() => answerModal.close()}
        isActive={answerModal.isActive}
      />
      <CustomModal
        title={t("action.delete")}
        onCancel={() => modal.close()}
        visible={modal.isActive}
        footer={
          <Button
            danger
            onClick={() => {
              deleteQuestion(state.selectedItem && state.selectedItem.guid);
            }}
            disabled={deleteQuestionInfo && deleteQuestionInfo.isLoading}
            loading={deleteQuestionInfo && deleteQuestionInfo.isLoading}
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
            total: questionList?.data?.data?.count,
            defaultCurrent: parseInt(state.page) || 1,
            pageSize: state.limit,
            current: parseInt(state.page),
            showSizeChanger: false,
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
                  _.get(questionList, ["data", "data", "count"])
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
                      history.push(`/games/question/${record.guid}`);
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
          dataSource={questionList?.data?.data?.results || []}
        />
      </Card>
    </Spin>
  );
};

export default QuestionsPage;
