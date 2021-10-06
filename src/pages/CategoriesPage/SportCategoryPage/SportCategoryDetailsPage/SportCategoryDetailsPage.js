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
import * as yup from "yup";
import { Field, FieldArray, Formik } from "formik";
import { useTranslation } from "react-i18next";

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

const SportCategoryDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    categories: [
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
      ? requests.category.sport.update
      : requests.category.sport.create,
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
        cashe.invalidateQueries(["sportcategory", params.id]);
        history.push("/categories?activeTab=sport");
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
    ["sportcategory", params.id],
    () => requests.category.sport.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  useEffect(() => {
    if (!sportItem.isLoading && sportItem.data) {
      setInitialValues({
        categories: _.get(sportItem, ["data", "data", "content"]),
      });
    }
  }, [sportItem]);

  const schema = yup.object().shape({
    categories: yup
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
      <MainTitle title={t("categories.sport")} />
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
            {({ handleSubmit, values }) => (
              <Form className="form-container" layout="vertical">
                <FieldArray name="categories">
                  {() => (
                    <div>
                      <Tabs
                        onChange={(key) => setActiveTab(key)}
                        activeKey={activeTab}
                      >
                        {values.categories.map((item, index) => (
                          <TabPane
                            tab={
                              language.list.find(
                                (lang) =>
                                  lang.id === values.categories[index].language
                              ) &&
                              language.list.find(
                                (lang) =>
                                  lang.id === values.categories[index].language
                              ).title
                            }
                            key={values.categories[index].language}
                          >
                            <Form.Item {...layout}>
                              <Field
                                component={AntInput}
                                name={`categories.${index}.title`}
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

export default SportCategoryDetailsPage;
