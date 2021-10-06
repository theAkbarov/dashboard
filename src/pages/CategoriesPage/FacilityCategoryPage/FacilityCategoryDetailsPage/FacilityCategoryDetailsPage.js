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
import { Field, FieldArray, Formik } from "formik";
import { useTranslation } from "react-i18next";

import * as language from "constants/language";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import { AntInput } from "components/CreateAntField/CreateAntField";
import { requests } from "services/requests";
import AvatarUpload from "components/AvatarUpload/AvatarUpload";
import * as yup from "yup";

const { TabPane } = Tabs;

const layout = {
  wrapperCol: { span: 8 },
};

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const FacilityCategoryDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    icon: "",
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
    visibility: true,
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
      ? requests.category.facility.update
      : requests.category.facility.create,
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
        cashe.invalidateQueries(["facilityCategory", params.id]);
        history.push("/categories?activeTab=facility");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const facilityCatItem = useQuery(
    ["facilityCategory", params.id],
    () => requests.category.facility.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  useEffect(() => {
    if (!facilityCatItem.isLoading && facilityCatItem.data) {
      setInitialValues(facilityCatItem?.data?.data);
    }
  }, [facilityCatItem]);

  const schema = yup.object().shape({
    icon: yup.string().required(t("validation.required")),
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
      <MainTitle title={t("categories.facility")} />
      <Card>
        {facilityCatItem.isLoading ? (
          <Skeleton active />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={schema}
            validator={() => {}}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched }) => (
              <Form className="form-container" layout="vertical">
                <FieldArray name="categories">
                  {() => (
                    <div>
                      <Tabs
                        onChange={(key) => setActiveTab(key)}
                        activeKey={activeTab}
                      >
                        {values.categories?.map((item, index) => (
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
                <Form.Item
                  name="icon"
                  label={t("form.icon")}
                  valuePropName="icon"
                  getValueFromEvent={""}
                  extra=""
                >
                  <AvatarUpload
                    setImageUrl={(url) => {
                      setFieldValue("icon", url);
                    }}
                    imageUrl={values.icon}
                    touched={touched.icon}
                    error={errors.icon}
                  />
                </Form.Item>
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

export default FacilityCategoryDetailsPage;
