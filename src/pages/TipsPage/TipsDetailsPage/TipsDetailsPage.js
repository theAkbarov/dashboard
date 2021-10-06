import React, { useEffect, useState } from "react";
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
  Tabs,
} from "antd";
import _ from "lodash";
import * as yup from "yup";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import { Field, FieldArray, Formik } from "formik";
import * as language from "constants/language";
import { AntInput } from "components/CreateAntField/CreateAntField";
import WYSIWYGEditor from "components/WYSIWYGEditor";

const { TabPane } = Tabs;

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const TipsDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    contents: [
      {
        title: "",
        body: "",
        language: "ru",
      },
      {
        title: "",
        body: "",
        language: "uz-Cyrl",
      },
      {
        title: "",
        body: "",
        language: "uz-Latn",
      },
      {
        title: "",
        body: "",
        language: "en",
      },
    ],
    visibility: true,
  });

  const handleSubmit = (values) => {
    addTip({
      id: params.id && params.id !== "create" ? params.id : "",
      data: { ...values, visibility: true },
    });
  };

  // Mutations
  const [addTip, addTipInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.tip.update
      : requests.tip.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["tip", params.id]);
        history.push("/tips");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const tipItem = useQuery(
    ["tip", params.id],
    () => requests.tip.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  useEffect(() => {
    if (!tipItem.isLoading && tipItem.data) {
      setInitialValues(_.get(tipItem, ["data", "data"]));
    }
  }, [tipItem]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
          body: yup.string().required(t("validation.required")),
        })
      )
      .required(),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.tips")} />
      <Card>
        {tipItem.isLoading ? (
          <Skeleton active />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
            validator={() => {}}
            validationSchema={schema}
          >
            {({
              handleSubmit,
              values,
              errors,
              submitCount,
              setFieldValue,
              touched,
              handleBlur,
            }) => (
              <Form className="form-container" layout="vertical">
                <FieldArray name="contents">
                  {(arrayHelpers) => (
                    <div>
                      <Tabs
                        onChange={(key) => setActiveTab(key)}
                        activeKey={activeTab}
                      >
                        {values.contents.map((content, index) => (
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
                            <Field
                              component={AntInput}
                              name={`contents.${index}.title`}
                              type="text"
                              label={t("form.title")}
                              hasFeedback
                            />
                            <WYSIWYGEditor
                              onChange={(val) => {
                                setFieldValue(`contents.${index}.body`, val);
                              }}
                              error={_.get(errors, `contents.${index}.body`)}
                              touched={_.get(touched, `contents.${index}.body`)}
                              data={values.contents[index].body}
                              editorState={`contents.${index}.body`}
                              label={t("form.body")}
                              onBlur={handleBlur}
                            />
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
                    loading={addTipInfo.isLoading}
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

export default TipsDetailsPage;
