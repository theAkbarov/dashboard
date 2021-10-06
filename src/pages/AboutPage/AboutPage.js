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
import { useMutation, useQuery, useQueryCache } from "react-query";
import _ from "lodash";
import moment from "moment";
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
import MapComponent from "components/MapComponent";

const { TabPane } = Tabs;

const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const layout = {
  wrapperCol: { span: 8 },
};

const AboutPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [categoryList, setCategoryList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    phone_number: "",
    address: "",
    email: "",
    taxi_route: "",
    closest_subway_station: "",
    buses: "",
    working_hours_from: "09:00",
    working_hours_to: "18:00",
    break_hours_from: "09:00",
    break_hours_to: "18:00",
    bus_station: "",
    working_days: [
      { day: 1, is_working_day: false },
      { day: 2, is_working_day: false },
      { day: 3, is_working_day: false },
      { day: 4, is_working_day: false },
      { day: 5, is_working_day: false },
      { day: 6, is_working_day: false },
      { day: 7, is_working_day: false },
    ],
  });

  const handleSubmit = (values) => {
    updateAbout(values);
  };

  // Mutations
  const [updateAbout, updateAboutInfo] = useMutation(requests.about.update, {
    onSuccess: (mes) => {
      notification.success({
        message: t("notification.success.general"),
        placement: "topRight",
      });
      cashe.invalidateQueries(["about"]);
    },
    onError: () => {
      notification.error({
        message: t("notification.error.general"),
        placement: "topRight",
      });
    },
  });

  const daysArray = [
    {
      day: 1,
      title: t("day.mon"),
    },
    {
      day: 2,
      title: t("day.tue"),
    },
    {
      day: 3,
      title: t("day.wed"),
    },
    {
      day: 4,
      title: t("day.thu"),
    },
    {
      day: 5,
      title: t("day.fri"),
    },
    {
      day: 6,
      title: t("day.sat"),
    },
    {
      day: 7,
      title: t("day.sun"),
    },
  ];

  const about = useQuery(["about"], () => requests.about.getInfo());

  useEffect(() => {
    if (!about.isLoading && about.data) {
      setInitialValues({
        ...initialValues,
        ...about?.data?.data,
      });
    }
  }, [about]);

  const schema = yup.object().shape({
    phone_number: yup.string().required(t("validation.required")),
    address: yup.string().required(t("validation.required")),
    email: yup
      .string()
      .email(t("validation.email"))
      .required(t("validation.required")),
    taxi_route: yup.string().required(t("validation.required")),
    closest_subway_station: yup.string().required(t("validation.required")),
    buses: yup.string().required(t("validation.required")),
    bus_station: yup.string().required(t("validation.required")),
    working_hours_from: yup.string().required(t("validation.required")),
    working_hours_to: yup.string().required(t("validation.required")),
    break_hours_from: yup.string().required(t("validation.required")),
    break_hours_to: yup.string().required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.about_us")} />
      <Card>
        {about.isLoading ? (
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
                <Field
                  component={AntInput}
                  name={`phone_number`}
                  type="text"
                  label={t("form.phone_number")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`address`}
                  type="text"
                  label={t("form.address")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`email`}
                  type="text"
                  label={t("form.email")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`buses`}
                  type="text"
                  label={t("form.buses")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`taxi_route`}
                  type="text"
                  label={t("form.taxi_route")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`bus_station`}
                  type="text"
                  label={t("form.bus_station")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`closest_subway_station`}
                  type="text"
                  label={t("form.closest_subway_station")}
                  hasFeedback
                />
                <br />
                <Form.Item
                  name="working_days"
                  label={t("form.working_days")}
                  initialValue={moment(values.working_days, "HH:mm")}
                >
                  <Space>
                    {daysArray.map((item, id) => {
                      const dayStatus =
                        values?.working_days?.length &&
                        values?.working_days?.find((d) => d.day === item.day)
                          ? values.working_days.find((d) => d.day === item.day)
                              .is_working_day
                          : false;

                      const oldlist = values?.working_days?.length
                        ? values?.working_days?.filter(
                            (d) => d.day !== item.day
                          )
                        : [];

                      return (
                        <Button
                          type={dayStatus ? "primary" : "dashed"}
                          key={id}
                          onClick={() =>
                            setFieldValue("working_days", [
                              ...oldlist,
                              {
                                day: item.day,
                                is_working_day: !dayStatus,
                              },
                            ])
                          }
                        >
                          {item.title}
                        </Button>
                      );
                    })}
                  </Space>
                </Form.Item>
                <br />
                <div>
                  <div>{t("form.working_hours_from")}</div>

                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "working_hours_from",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values.working_hours_from, "HH:mm")}
                    value={moment(values.working_hours_from, "HH:mm")}
                  />
                </div>
                <br />
                <div>
                  <div>{t("form.working_hours_to")}</div>
                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "working_hours_to",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values["working_hours_to"], "HH:mm")}
                    value={moment(values["working_hours_to"], "HH:mm")}
                  />
                </div>
                <br />
                <div>
                  <div>{t("form.break_hours_from")}</div>
                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "break_hours_from",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values.break_hours_from, "HH:mm")}
                    value={moment(values.break_hours_from, "HH:mm")}
                  />
                </div>
                <br />
                <div>
                  <div>{t("form.break_hours_to")}</div>
                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "break_hours_to",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values.break_hours_to, "HH:mm")}
                    value={moment(values.break_hours_to, "HH:mm")}
                  />
                </div>
                <br />
                <Form.Item name="button" {...tailLayout}>
                  <Button
                    type="primary"
                    loading={updateAboutInfo.isLoading}
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

export default AboutPage;
