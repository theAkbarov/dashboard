import React, { useEffect, useState } from "react";
import {
  Skeleton,
  Button,
  Card,
  Divider,
  Form,
  notification,
  Tabs,
  Space,
} from "antd";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryCache } from "react-query";
import _ from "lodash";
import * as yup from "yup";

import * as language from "constants/language";
import { useTranslation } from "react-i18next";
import Spin from "components/Spin";
import MainTitle from "components/MainTitle";
import { requests } from "services/requests";
import AvatarUpload from "components/AvatarUpload/AvatarUpload";
import { Field, FieldArray, Formik } from "formik";
import { AntInput, AntSelect } from "components/CreateAntField/CreateAntField";
import WYSIWYGEditor from "components/WYSIWYGEditor";
import AntSwitch from "components/AntSwitch";

const { TabPane } = Tabs;

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const ParentalInfoDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    contents: [
      {
        title: "",
        description: "",
        language: "ru",
      },
      {
        title: "",
        description: "",
        language: "uz-Cyrl",
      },
      {
        title: "",
        description: "",
        language: "uz-Latn",
      },
      {
        title: "",
        description: "",
        language: "en",
      },
    ],
    image: "",
    thumbnail: "",
    visibility: true,
    parental_category: "",
  });

  const handleSubmit = (values) => {
    addParental({
      id: params.id && params.id !== "create" ? params.id : "",
      data: { ...values },
    });
  };

  // Mutations
  const [addParental, addParentalInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.parental.info.update
      : requests.parental.info.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["parentalInfo", params.id]);
        history.push("/parental-info");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const parentalInfoItem = useQuery(
    ["parentalInfo", params.id],
    () => requests.parental.info.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  const parentalInfoCatList = useQuery(["parentalInfoCategoryList"], () =>
    requests.category.parental.info.getAll()
  );

  useEffect(() => {
    let data = {};
    if (!parentalInfoCatList.isLoading && parentalInfoCatList.data) {
      data = {
        ...initialValues,
        categoryList: _.get(parentalInfoCatList, ["data", "data", "results"]),
      };
    }
    if (!parentalInfoItem.isLoading && parentalInfoItem.data) {
      data = {
        ...initialValues,
        ..._.get(parentalInfoItem, ["data", "data"]),
      };
    }

    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [parentalInfoItem, parentalInfoCatList]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
          description: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    image: yup.string().required(t("validation.required")),
    parental_category: yup.string().required(t("validation.required")),
    thumbnail: yup.string().required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.infographics")} />
      <Card>
        {parentalInfoItem.isLoading ? (
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
                                setFieldValue(
                                  `contents.${index}.description`,
                                  val
                                );
                              }}
                              error={_.get(
                                errors,
                                `contents.${index}.description`
                              )}
                              touched={_.get(
                                touched,
                                `contents.${index}.description`
                              )}
                              data={values.contents[index].description}
                              editorState={`contents.${index}.description`}
                              onBlur={handleBlur}
                              label={t("form.description")}
                            />
                          </TabPane>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </FieldArray>
                <Divider />
                <Field
                  component={AntSelect}
                  name="parental_category"
                  label={t("form.category")}
                  defaultValue={values.parental_category}
                  selectOptions={values.categoryList}
                  submitCount={submitCount}
                  selectKey="guid"
                  selectName="title"
                  style={{ width: 200 }}
                  hasFeedback
                />
                <Space>
                  <Form.Item name="thumbnail" label={t("form.thumbnail")}>
                    <AvatarUpload
                      setImageUrl={(url) => {
                        setFieldValue("thumbnail", url);
                      }}
                      imageUrl={values.thumbnail}
                      touched={touched.thumbnail}
                      error={errors.thumbnail}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                  <Form.Item name="image" label={t("form.image")}>
                    <AvatarUpload
                      setImageUrl={(url) => {
                        setFieldValue("image", url);
                      }}
                      imageUrl={values.image}
                      touched={touched.thumbnail}
                      error={errors.image}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Space>
                <Form.Item name="visibility" label={t("form.visibility")}>
                  <AntSwitch
                    onChange={(val) => {
                      setFieldValue(`visibility`, val);
                    }}
                    checked={values.visibility}
                  />
                </Form.Item>
                <Form.Item name="button" {...tailLayout}>
                  <Button
                    type="primary"
                    loading={addParentalInfo.isLoading}
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

export default ParentalInfoDetailsPage;
