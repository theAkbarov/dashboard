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
import { requests } from "services/requests";
import { AntInput } from "components/CreateAntField/CreateAntField";
import WYSIWYGEditor from "components/WYSIWYGEditor";
import AntSwitch from "components/AntSwitch";
import MultipleUpload from "components/MultipleUpload";

const { TabPane } = Tabs;

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const DictionaryDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [initialValues, setInitialValues] = useState({
    contents: [
      {
        word: "",
        description: "",
        language: "ru",
      },
      {
        word: "",
        description: "",
        language: "uz-Cyrl",
      },
      {
        word: "",
        description: "",
        language: "uz-Latn",
      },
      {
        word: "",
        description: "",
        language: "en",
      },
    ],
    visibility: true,
    images: [],
  });

  const handleSubmit = (values) => {
    addDictionary({
      id: params.id && params.id !== "create" ? params.id : "",
      data: {
        ...values,
      },
    });
  };

  // Mutations
  const [addDictionary, addDictionaryInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.dictionary.update
      : requests.dictionary.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["dictionary", params.id]);
        history.push("/dictionary");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const dictionaryItem = useQuery(
    ["dictionary", params.id],
    () => requests.dictionary.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  useEffect(() => {
    if (!dictionaryItem.isLoading && dictionaryItem.data) {
      setInitialValues(_.get(dictionaryItem, ["data", "data"]));
    }
  }, [dictionaryItem]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          word: yup.string().required(t("validation.required")),
          description: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    images: yup.array().min(1).required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.dictionary")} />
      <Card>
        {dictionaryItem.isLoading ? (
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
              setFieldValue,
              touched,
              handleBlur,
            }) => {
              return (
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
                                name={`contents.${index}.word`}
                                type="text"
                                label={t("form.word")}
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
                  <Form.Item name="images" label={t("form.image")}>
                    <MultipleUpload
                      itemKey="image_url"
                      images={values.images}
                      setImages={(image_url) =>
                        setFieldValue("images", [
                          ...values.images,
                          { image_url },
                        ])
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
                      loading={addDictionaryInfo.isLoading}
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

export default DictionaryDetailsPage;
