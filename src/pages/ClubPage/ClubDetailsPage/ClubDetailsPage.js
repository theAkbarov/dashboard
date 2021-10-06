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
  TimePicker,
} from "antd";
import { useParams, useHistory } from "react-router-dom";
import {
  useMutation,
  usePaginatedQuery,
  useQuery,
  useQueryCache,
} from "react-query";
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
import useQueryParams from "hooks/useQueryParams";
import moment from "moment";

const { TabPane } = Tabs;

const layout = {
  wrapperCol: { span: 8 },
};

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const ClubDetailsPage = () => {
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
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
    facility: queryParams?.values?.facility || "",
    facilityList: [],
    child_age_from: "",
    child_age_to: "",
    club_hour_from: "09:00",
    club_hour_to: "18:00",
    visibility: true,
  });

  const handleSubmit = (values) => {
    addClub({
      id: params.id && params.id !== "create" ? params.id : "",
      data: {
        ...values,
      },
    });
  };

  // Mutations
  const [addClub, addClubInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.club.update
      : requests.club.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["club", params.id]);
        history.push("/club");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  const clubItem = useQuery(
    ["club", params.id],
    () => requests.club.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  const facilityList = useQuery(["facilityList"], () =>
    requests.facility.getAllList()
  );

  useEffect(() => {
    let data = {};
    if (!clubItem.isLoading && clubItem.data) {
      data = {
        ...initialValues,
        ..._.get(clubItem, ["data", "data"]),
        contents: _.get(clubItem, ["data", "data", "contents"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [clubItem]);

  useEffect(() => {
    let data = {};
    if (!facilityList.isLoading && facilityList.data) {
      data = {
        ...initialValues,
        facilityList: _.get(facilityList, ["data", "data", "results"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [facilityList]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    facility: yup.string().required(t("validation.required")),
    child_age_from: yup
      .number()
      .typeError(t("validation.number"))
      .max(100, t("validation.invalid_age"))
      .min(1, t("validation.invalid_age"))
      .required(t("validation.required")),
    child_age_to: yup
      .number()
      .typeError(t("validation.number"))
      .max(100, t("validation.invalid_age"))
      .min(1, t("validation.invalid_age"))
      .required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.sport_club")} />
      <Card>
        {clubItem.isLoading ? (
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
              <Form className="form-container" layout="vertical" {...layout}>
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
                          </TabPane>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </FieldArray>
                <Divider />
                <Field
                  component={AntSelect}
                  name="facility"
                  loading={facilityList.isLoading}
                  label={t("categories.facility")}
                  defaultValue={values.facility}
                  selectOptions={values.facilityList}
                  submitCount={submitCount}
                  selectKey="guid"
                  selectName="title"
                  style={{ width: 200 }}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`child_age_from`}
                  type="text"
                  label={t("form.child_age_from")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`child_age_to`}
                  type="text"
                  label={t("form.child_age_to")}
                  hasFeedback
                />
                <div>
                  <div>{t("form.club_hour_from")}</div>
                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "club_hour_from",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values.club_hour_from, "HH:mm")}
                    value={moment(values.club_hour_from, "HH:mm")}
                  />
                </div>
                <br />
                <div>
                  <div>{t("form.club_hour_to")}</div>

                  <TimePicker
                    onChange={(val) =>
                      setFieldValue("club_hour_to", moment(val).format("HH:mm"))
                    }
                    format="HH:mm"
                    defaultValue={moment(values.club_hour_to, "HH:mm")}
                    value={moment(values.club_hour_to, "HH:mm")}
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
                <Form.Item name="button" {...tailLayout}>
                  <Button
                    type="primary"
                    loading={addClubInfo.isLoading}
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

export default ClubDetailsPage;
