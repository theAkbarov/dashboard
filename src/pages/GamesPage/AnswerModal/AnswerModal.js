import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { requests } from "services/requests";
import { Button, Divider, Form, notification, Tabs } from "antd";
import * as yup from "yup";
import CustomModal from "components/CustomModal";
import { Field, FieldArray, Formik } from "formik";
import * as language from "constants/language";
import { AntInput } from "components/CreateAntField/CreateAntField";
import AvatarUpload from "components/AvatarUpload/AvatarUpload";
import Spin from "components/Spin";
import useQueryParams from "hooks/useQueryParams";
import AntSwitch from "components/AntSwitch";

const { TabPane } = Tabs;

const AnswerModal = ({ selectedAnswer, isActive, close }) => {
  const { t } = useTranslation();
  let cache = useQueryCache();
  let params = useParams();
  let history = useHistory();
  const queryParams = useQueryParams();
  const [activeTab, setActiveTab] = useState("ru");
  const initialValues = {
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
    question: params?.id || "",
    visibility: true,
    is_right_answer: true,
    image: "",
  };
  const [answerValues, setAnswerValues] = useState(initialValues);

  const answer = useQuery(
    ["answer", selectedAnswer?.guid],
    () => requests.game.answer.getSingle(selectedAnswer?.guid),
    { enabled: selectedAnswer }
  );

  useEffect(() => {
    if (!answer.isLoading && answer.data) {
      setAnswerValues({ ...answer?.data?.data, question: params?.id });
    }
  }, [answer]);

  const [addAnswer, addAnswerInfo] = useMutation(
    selectedAnswer ? requests.game.answer.update : requests.game.answer.create,
    {
      onSuccess: () => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        close();
        cache.invalidateQueries(["question", params.id]);
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
        close();
        cache.invalidateQueries("question");
      },
    }
  );

  useEffect(() => {
    if (!isActive) setAnswerValues(initialValues);
  }, [isActive]);

  const answerSchema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    image: yup.string().required(t("validation.required")),
  });

  const handleAnswerSubmit = (values) => {
    addAnswer({
      id: selectedAnswer?.guid,
      data: { ...values, visibility: true, question: params?.id },
    });
  };

  return (
    <CustomModal
      title={t("form.add_answer")}
      onCancel={() => close()}
      visible={isActive}
      footer={null}
    >
      <Spin spinning={answer.isLoading}>
        <Formik
          initialValues={answerValues}
          onSubmit={handleAnswerSubmit}
          enableReinitialize
          validationSchema={answerSchema}
          validator={() => {}}
        >
          {({
            handleSubmit,
            values,
            errors,
            setFieldValue,
            touched,
            handleBlur,
          }) => (
            <Form className="form-container" layout="vertical">
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
              <Form.Item label={t("form.image")}>
                <AvatarUpload
                  setImageUrl={(url) => {
                    setFieldValue("image", url);
                  }}
                  imageUrl={values.image}
                  touched={touched.image}
                  error={errors.image}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item
                name="is_right_answer"
                label={t("form.is_right_answer")}
              >
                <AntSwitch
                  onChange={(val) => {
                    setFieldValue(`is_right_answer`, val);
                  }}
                  checked={values.is_right_answer}
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
              <Form.Item name="button">
                <Button
                  type="primary"
                  loading={addAnswerInfo.isLoading}
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
      </Spin>
    </CustomModal>
  );
};

export default AnswerModal;
