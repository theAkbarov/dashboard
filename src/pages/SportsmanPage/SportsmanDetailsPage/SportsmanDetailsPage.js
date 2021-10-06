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
import MultipleUpload from "components/MultipleUpload";

const { TabPane } = Tabs;

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const SportsmanDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    contents: [
      {
        first_name: "",
        last_name: "",
        title: "",
        body: "",
        language: "ru",
      },
      {
        first_name: "",
        last_name: "",
        title: "",
        body: "",
        language: "uz-Cyrl",
      },
      {
        first_name: "",
        last_name: "",
        title: "",
        body: "",
        language: "uz-Latn",
      },
      {
        first_name: "",
        last_name: "",
        title: "",
        body: "",
        language: "en",
      },
    ],
    category: "",
    categoryList: [],
    profile_picture: "",
    visibility: true,
    images: [],
  });

  const handleSubmit = (values) => {
    addSportsman({
      id: params.id && params.id !== "create" ? params.id : "",
      data: {
        ...values,
      },
    });
  };

  // Mutations
  const [addSportsman, addSportsmanInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.sportsman.update
      : requests.sportsman.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["sportsman", params.id]);
        history.push("/sportsman");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const sportsmanItem = useQuery(
    ["sportsman", params.id],
    () => requests.sportsman.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  const sportCategoryList = useQuery(["sportCategoryList"], () =>
    requests.category.sport.getAll()
  );

  useEffect(() => {
    let data = {};
    if (!sportCategoryList.isLoading && sportCategoryList.data) {
      data = {
        ...initialValues,
        categoryList: _.get(sportCategoryList, ["data", "data"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [sportCategoryList]);

  useEffect(() => {
    let data = {};
    if (!sportsmanItem.isLoading && sportsmanItem.data) {
      data = {
        ...initialValues,
        ..._.get(sportsmanItem, ["data", "data"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [sportsmanItem]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          first_name: yup.string().required(t("validation.required")),
          last_name: yup.string().required(t("validation.required")),
          title: yup.string().required(t("validation.required")),
          body: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    category: yup.string().required(t("validation.required")),
    profile_picture: yup.string().required(t("validation.required")),
    images: yup.array().min(1).required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.sportsmen")} />
      <Card>
        {sportsmanItem.isLoading ? (
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
                        {values.contents?.length
                          ? values.contents.map((content, index) => (
                              <TabPane
                                tab={
                                  language.list.find(
                                    (lang) =>
                                      lang.id ===
                                      values.contents[index].language
                                  ) &&
                                  language.list.find(
                                    (lang) =>
                                      lang.id ===
                                      values.contents[index].language
                                  ).title
                                }
                                key={values.contents[index].language}
                              >
                                <Field
                                  component={AntInput}
                                  name={`contents.${index}.first_name`}
                                  type="text"
                                  label={t("form.first_name")}
                                  hasFeedback
                                />
                                <Field
                                  component={AntInput}
                                  name={`contents.${index}.last_name`}
                                  type="text"
                                  label={t("form.last_name")}
                                  hasFeedback
                                />
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
                                      `contents.${index}.body`,
                                      val
                                    );
                                  }}
                                  error={_.get(
                                    errors,
                                    `contents.${index}.body`
                                  )}
                                  touched={_.get(
                                    touched,
                                    `contents.${index}.body`
                                  )}
                                  data={values.contents[index].body}
                                  editorState={`contents.${index}.body`}
                                  onBlur={handleBlur}
                                  label={t("form.text")}
                                />
                              </TabPane>
                            ))
                          : null}
                      </Tabs>
                    </div>
                  )}
                </FieldArray>
                <Divider />
                <Field
                  component={AntSelect}
                  name="category"
                  label={t("form.category")}
                  defaultValue={values.category}
                  selectOptions={values.categoryList}
                  submitCount={submitCount}
                  selectKey="guid"
                  selectName="title"
                  style={{ width: 200 }}
                  hasFeedback
                />
                <Space>
                  <Form.Item
                    name="profile_picture"
                    label={t("form.profile_picture")}
                  >
                    <AvatarUpload
                      setImageUrl={(url) => {
                        setFieldValue("profile_picture", url);
                      }}
                      imageUrl={values.profile_picture}
                      touched={touched.profile_picture}
                      error={errors.profile_picture}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Space>
                <Form.Item name="images" label={t("form.images")}>
                  <MultipleUpload
                    itemKey="image"
                    images={values.images}
                    setImages={(image) =>
                      setFieldValue("images", [...values.images, { image }])
                    }
                  />
                </Form.Item>
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
                    loading={addSportsmanInfo.isLoading}
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

export default SportsmanDetailsPage;
