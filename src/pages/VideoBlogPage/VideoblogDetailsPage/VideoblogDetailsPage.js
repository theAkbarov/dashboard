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

const VideoblogDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    video_blog_contents: [
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
    category: "",
    thumbnail: "",
    video_file: "",
    categoryList: [],
    visibility: true,
    images: [],
  });

  const handleSubmit = (values) => {
    addVideoBlog({
      id: params.id && params.id !== "create" ? params.id : "",
      data: {
        ...values,
      },
    });
  };

  // Mutations
  const [addVideoBlog, addVideoBlogInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.videoblog.update
      : requests.videoblog.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["videoblog", params.id]);
        history.push("/videoblog");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const videoBlogItem = useQuery(
    ["videoblog", params.id],
    () => requests.videoblog.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  const videoBlogCategoryList = useQuery(["videoBlogCategoryList"], () =>
    requests.category.videoblog.getAll()
  );

  useEffect(() => {
    let data = {};
    if (!videoBlogCategoryList.isLoading && videoBlogCategoryList.data) {
      data = {
        ...initialValues,
        categoryList: _.get(videoBlogCategoryList, ["data", "data"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [videoBlogCategoryList]);

  useEffect(() => {
    let data = {};
    if (!videoBlogItem.isLoading && videoBlogItem.data) {
      data = {
        ...initialValues,
        ..._.get(videoBlogItem, ["data", "data"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [videoBlogItem]);

  const schema = yup.object().shape({
    video_blog_contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    category: yup.string().required(t("validation.required")),
    video_file: yup.string().required(t("validation.required")),
    thumbnail: yup.string().required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.videoblog")} />
      <Card>
        {videoBlogItem.isLoading ? (
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
                <FieldArray name="video_blog_contents">
                  {(arrayHelpers) => (
                    <div>
                      <Tabs
                        onChange={(key) => setActiveTab(key)}
                        activeKey={activeTab}
                      >
                        {values.video_blog_contents?.length
                          ? values.video_blog_contents.map((content, index) => (
                              <TabPane
                                tab={
                                  language.list.find(
                                    (lang) =>
                                      lang.id ===
                                      values.video_blog_contents[index].language
                                  ) &&
                                  language.list.find(
                                    (lang) =>
                                      lang.id ===
                                      values.video_blog_contents[index].language
                                  ).title
                                }
                                key={values.video_blog_contents[index].language}
                              >
                                <Field
                                  component={AntInput}
                                  name={`video_blog_contents.${index}.title`}
                                  type="text"
                                  label={t("form.title")}
                                  hasFeedback
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
                </Space>
                <Field
                  component={AntInput}
                  name={`video_file`}
                  type="text"
                  label={`${t("form.video_link")} (YouTube)`}
                  hasFeedback
                />
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
                    loading={addVideoBlogInfo.isLoading}
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

export default VideoblogDetailsPage;
