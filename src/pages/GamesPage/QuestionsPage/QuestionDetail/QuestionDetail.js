import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import {
  Button,
  Card,
  Divider,
  Form,
  notification,
  Skeleton,
  Space,
  Table,
  Tabs,
  TimePicker,
} from "antd";
import _ from "lodash";
import * as yup from "yup";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import { Field, FieldArray, Formik } from "formik";
import * as language from "constants/language";
import { AntInput, AntSelect } from "components/CreateAntField/CreateAntField";
import moment from "moment";
import useModal from "hooks/useModal";
import CustomModal from "components/CustomModal";
import AvatarUpload from "components/AvatarUpload/AvatarUpload";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { isNormalInteger } from "utils/isNormalInteger";
import AnswerModal from "pages/GamesPage/AnswerModal";
import AntSwitch from "components/AntSwitch";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

const layout = {
  wrapperCol: { span: 8 },
};

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const getNumbers = (num) => {
  let items = [];
  for (let i = 0; i < num; i++) {
    items = [
      ...items,
      {
        title: i + 1,
      },
    ];
  }
  return items;
};

const QuestionDetail = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  const addAnswerModal = useModal();
  const deleteAnswerModal = useModal();
  let cache = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [state, setState] = useState({
    selectedItem: null,
  });
  const [initialValues, setInitialValues] = useState({
    contents: [
      {
        title: "",
        language: "ru",
      },
      {
        title: "",
        language: "uz-Cyrl",
      },
      {
        title: "",
        language: "uz-Latn",
      },
      {
        title: "",
        language: "en",
      },
    ],
    level: 1,
    point: 1,
    visibility: true,
    expiration_time: "00:00:15",
    type: "SPORT_TEST",
  });
  const systemLanguage = useSelector((state) => state?.system?.language);

  const gameTypes = [
    {
      title: t("game.type.yes_no"),
      value: "YES_NO",
    },
    {
      title: t("game.type.figure_out"),
      value: "FIGURE_OUT",
    },
    {
      title: t("game.type.sport_test"),
      value: "SPORT_TEST",
    },
  ];

  const handleSubmit = (values) => {
    addItem({
      id: params.id && params.id !== "create" ? params.id : "",
      data: { ...values, visibility: true },
    });
  };

  // Mutations
  const [addItem, addItemInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.game.question.update
      : requests.game.question.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t(
            `notification.success.${
              params.id && params.id !== "create" ? "update" : "create"
            }`
          ),
          placement: "topRight",
        });
        cache.invalidateQueries(["question", params.id]);
        history.push("/games");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const [deleteAnswer, deleteAnswerInfo] = useMutation(
    requests.game.answer.delete,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.delete"),
          placement: "topRight",
        });
        deleteAnswerModal.close();
        cache.invalidateQueries("question");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        deleteAnswerModal.close();
        cache.invalidateQueries("question");
      },
    }
  );

  const question = useQuery(
    ["question", params.id],
    () => requests.game.question.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  useEffect(() => {
    if (!question.isLoading && question.data) {
      setInitialValues(question?.data?.data);
    }
  }, [question]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    point: yup
      .number()
      .typeError(t("validation.number"))
      .required(t("validation.required")),
    expiration_time: yup.string().required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <CustomModal
        title={t("action.delete")}
        onCancel={() => deleteAnswerModal.close()}
        visible={deleteAnswerModal.isActive}
        footer={
          <Button
            danger
            onClick={() => {
              deleteAnswer(state?.selectedItem?.guid);
            }}
            disabled={deleteAnswerInfo?.isLoading}
            loading={deleteAnswerInfo?.isLoading}
            type="primary"
          >
            {t("action.delete")}
          </Button>
        }
      >
        {t("question.deleting")}
        <br />
        <b>{state?.selectedItem?.title}</b>
      </CustomModal>
      <AnswerModal
        isActive={addAnswerModal.isActive}
        close={() => addAnswerModal.close()}
        selectedAnswer={state.selectedItem}
      />
      <MainTitle title={t("form.question")} />
      <Card>
        {question.isLoading ? (
          <Skeleton active />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={schema}
            validator={() => {}}
          >
            {({ handleSubmit, values, setFieldValue }) => (
              <Form className="form-container" layout="vertical" {...layout}>
                <FieldArray name="contents">
                  {() => (
                    <div>
                      <Tabs
                        onChange={(key) => setActiveTab(key)}
                        activeKey={activeTab}
                      >
                        {values.contents.map((item, index) => (
                          <TabPane
                            tab={
                              language.list.find(
                                (lang) =>
                                  lang.id === values.contents[index].language
                              ) &&
                              language.list.find(
                                (lang) =>
                                  lang.id === values.contents[index].language
                              ).title
                            }
                            key={values.contents[index].language}
                          >
                            <Form.Item>
                              <Field
                                component={AntInput}
                                name={`contents.${index}.title`}
                                type="text"
                                label={t("form.title")}
                                hasFeedback
                              />
                            </Form.Item>
                          </TabPane>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </FieldArray>
                <Divider />
                <Field
                  component={AntSelect}
                  name="type"
                  loading={false}
                  label={t("form.game")}
                  defaultValue={values.type}
                  selectOptions={gameTypes}
                  selectKey="value"
                  selectName="title"
                  hasFeedback
                />
                <Field
                  component={AntSelect}
                  name="level"
                  loading={false}
                  label={t("form.level")}
                  defaultValue={values.level}
                  selectOptions={getNumbers(10)}
                  selectKey="title"
                  selectName="title"
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`point`}
                  type="text"
                  label={t("form.point")}
                  hasFeedback
                />
                <br />
                <div>
                  <div>{t("form.expiration_time")}</div>
                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "expiration_time",
                        moment(val).format("HH:mm:ss")
                      )
                    }
                    format="HH:mm:ss"
                    defaultValue={moment(values.expiration_time, "HH:mm:ss")}
                    value={moment(values.expiration_time, "HH:mm:ss")}
                  />
                </div>
                <br />
                <Form.Item name="visibility" label={t("form.visibility")}>
                  <AntSwitch
                    onChange={(val) => {
                      setFieldValue(`visibility`, val);
                    }}
                    checked={values.visibility}
                  />
                </Form.Item>
                <Divider />
                {question?.data ? (
                  <Fragment>
                    <Button
                      onClick={() => {
                        setState({
                          ...state,
                          selectedItem: null,
                        });
                        addAnswerModal.open();
                      }}
                      type="primary"
                    >
                      {t("form.add_answer")}
                    </Button>
                    <br />
                    <Table
                      rowKey="guid"
                      size="middle"
                      style={{ overflowX: "scroll" }}
                      ellipsis
                      pagination={false}
                      columns={[
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
                        {
                          title: t("form.title"),
                          dataIndex: "contents",
                          render: (contents) =>
                            contents?.find((i) => i.language === systemLanguage)
                              ?.title,
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
                                  addAnswerModal.open();
                                  setState({
                                    ...state,
                                    selectedItem: record,
                                  });
                                }}
                              />
                              <Button
                                type="link"
                                icon={
                                  <DeleteOutlined style={{ color: "red" }} />
                                }
                                onClick={() => {
                                  setState({
                                    ...state,
                                    selectedItem: record,
                                  });
                                  deleteAnswerModal.open();
                                }}
                              />
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={question?.data?.data?.answers || []}
                    />
                  </Fragment>
                ) : null}
                <br />
                <Form.Item name="button" {...tailLayout}>
                  <Button
                    type="primary"
                    loading={addItemInfo.isLoading}
                    htmlType="submit"
                    className="login-form-button"
                    onClick={handleSubmit}
                  >
                    {t("action.save")}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        )}
      </Card>
    </Spin>
  );
};

export default QuestionDetail;
