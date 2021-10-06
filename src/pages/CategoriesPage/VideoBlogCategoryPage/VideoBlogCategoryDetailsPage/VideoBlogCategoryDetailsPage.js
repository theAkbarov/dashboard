import React, { useEffect, useState } from "react";
import {
  Skeleton,
  Button,
  Card,
  Divider,
  Form,
  notification,
  Tabs,
} from "antd";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryCache } from "react-query";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Field, FieldArray, Formik } from "formik";
import * as yup from "yup";

import * as language from "constants/language";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import { AntInput } from "components/CreateAntField/CreateAntField";
import { requests } from "services/requests";

const { TabPane } = Tabs;

const layout = {
  wrapperCol: { span: 8 },
};

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const VideoBlogCategoryDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    video_blog_category_contents: [
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
  });

  const handleSubmit = (values) => {
    addItem({
      id: params.id && params.id !== "create" ? params.id : "",
      data: { ...values, visibility: true },
    });
  };

  // Mutations
  const [addItem, addItemInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.category.videoblog.update
      : requests.category.videoblog.create,
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
        cashe.invalidateQueries(["videoblogCategory", params.id]);
        history.push("/categories?activeTab=videoblog");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const sportItem = useQuery(
    ["videoblogCategory", params.id],
    () => requests.category.videoblog.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  useEffect(() => {
    if (!sportItem.isLoading && sportItem.data) {
      setInitialValues(_.get(sportItem, ["data", "data"]));
    }
  }, [sportItem]);

  const schema = yup.object().shape({
    video_blog_category_contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
        })
      )
      .required(),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("categories.videoblog")} />
      <Card>
        {sportItem.isLoading ? (
          <Skeleton active />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={schema}
            validator={() => {}}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form className="form-container" layout="vertical">
                  <FieldArray name="video_blog_category_contents">
                    {() => (
                      <div>
                        <Tabs
                          onChange={(key) => setActiveTab(key)}
                          activeKey={activeTab}
                        >
                          {values.video_blog_category_contents?.map(
                            (item, index) => (
                              <TabPane
                                tab={
                                  language.list.find(
                                    (lang) =>
                                      lang.id ===
                                      values.video_blog_category_contents[index]
                                        .language
                                  ) &&
                                  language.list.find(
                                    (lang) =>
                                      lang.id ===
                                      values.video_blog_category_contents[index]
                                        .language
                                  ).title
                                }
                                key={
                                  values.video_blog_category_contents[index]
                                    .language
                                }
                              >
                                <Form.Item {...layout}>
                                  <Field
                                    component={AntInput}
                                    name={`video_blog_category_contents.${index}.title`}
                                    type="text"
                                    label={t("form.title")}
                                    hasFeedback
                                  />
                                </Form.Item>
                              </TabPane>
                            )
                          )}
                        </Tabs>
                      </div>
                    )}
                  </FieldArray>
                  <Divider />
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
              );
            }}
          </Formik>
        )}
      </Card>
    </Spin>
  );
};

export default VideoBlogCategoryDetailsPage;
