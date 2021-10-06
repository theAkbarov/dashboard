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

const FacilityDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();
  const [activeTab, setActiveTab] = useState("ru");
  const [categoryList, setCategoryList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    contents: [
      {
        title: "",
        address: "",
        body: "",
        language: "ru",
      },
      {
        title: "",
        address: "",
        body: "",
        language: "uz-Cyrl",
      },
      {
        title: "",
        address: "",
        body: "",
        language: "uz-Latn",
      },
      {
        title: "",
        address: "",
        body: "",
        language: "en",
      },
    ],

    profile_picture: "",
    category: "",
    region: "",
    taxi_route: "",
    closest_subway_station: "",
    buses: "",
    visibility: true,
    images: [],
    days: [
      { day: 1, is_working_day: false },
      { day: 2, is_working_day: false },
      { day: 3, is_working_day: false },
      { day: 4, is_working_day: false },
      { day: 5, is_working_day: false },
      { day: 6, is_working_day: false },
      { day: 7, is_working_day: false },
    ],
    latitude: 41.311,
    longitude: 69.279,
    working_hour_from: "09:00",
    working_hour_to: "18:00",
    bus_station: "",
    phone: "",
    capacity: "",
  });

  const handleSubmit = (values) => {
    addFacility({
      id: params.id && params.id !== "create" ? params.id : "",
      data: {
        ...values,
      },
    });
  };

  // Mutations
  const [addFacility, addFacilityInfo] = useMutation(
    params.id && params.id !== "create"
      ? requests.facility.update
      : requests.facility.create,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.create"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["facility", params.id]);
        history.push("/facilities");
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

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

  const regionList = [
    {
      id: "ANDIJAN",
      title: t("region"),
    },
    {
      id: "BUKHARA",
      title: t("region"),
    },
    {
      id: "JIZZAKH",
      title: t("region"),
    },
    {
      id: "KASHKADARYA",
      title: t("region"),
    },
    {
      id: "NAVOI",
      title: t("region"),
    },
    {
      id: "NAMANGAN",
      title: t("region"),
    },
    {
      id: "SAMARKAND",
      title: t("region"),
    },
    {
      id: "SIRDARYA",
      title: t("region"),
    },
    {
      id: "SURKHANDARYA",
      title: t("region"),
    },
    {
      id: "TASHKENT",
      title: t("region"),
    },
    {
      id: "FERGANA",
      title: t("region"),
    },
    {
      id: "KHOREZM",
      title: t("region"),
    },
    {
      id: "TASHKENT_REGION",
      title: t("region"),
    },
    {
      id: "KARAKALPAK",
      title: t("region"),
    },
  ];

  const facilityItem = useQuery(
    ["facility", params.id],
    () => requests.facility.getSingle(params.id),
    { enabled: params.id && params.id !== "create" }
  );

  const facilityCategoryList = useQuery(["facilityCategoryList"], () =>
    requests.category.facility.getAll()
  );

  useEffect(() => {
    let data = {};

    if (!facilityItem.isLoading && facilityItem.data) {
      data = {
        ...initialValues,
        ..._.get(facilityItem, ["data", "data"]),
      };
    }
    if (data) {
      setInitialValues({
        ...initialValues,
        ...data,
      });
    }
  }, [facilityItem]);

  useEffect(() => {
    setCategoryList(
      _.get(facilityCategoryList, ["data", "data", "results"]) || []
    );
  }, [facilityCategoryList]);

  const schema = yup.object().shape({
    contents: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
          address: yup.string().required(t("validation.required")),
          body: yup.string().required(t("validation.required")),
        })
      )
      .required(),
    category: yup.string().required(t("validation.required")),
    profile_picture: yup.string().required(t("validation.required")),
    region: yup.string().required(t("validation.required")),
    taxi_route: yup.string().required(t("validation.required")),
    closest_subway_station: yup.string().required(t("validation.required")),
    bus_station: yup.string().required(t("validation.required")),
    phone: yup.string().required(t("validation.required")),
    capacity: yup
      .number()
      .typeError(t("validation.number"))
      .required(t("validation.required")),
    buses: yup.string().required(t("validation.required")),
    images: yup.array().min(1).required(t("validation.required")),
  });

  return (
    <Spin spinning={false}>
      <MainTitle title={t("sidebar.facilities")} />
      <Card>
        {facilityItem.isLoading ? (
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
                            <Field
                              component={AntInput}
                              name={`contents.${index}.address`}
                              type="text"
                              label={t("form.address")}
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
                              onBlur={handleBlur}
                              label={t("form.text")}
                            />
                          </TabPane>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </FieldArray>
                <Divider />
                <MapComponent
                  isMarkerShown
                  markerPosition={{
                    lat: parseFloat(values.latitude),
                    lng: parseFloat(values.longitude),
                  }}
                  center={{
                    lat: parseFloat(values.latitude),
                    lng: parseFloat(values.longitude),
                  }}
                  defaultCenter={{
                    lat: parseFloat(values.latitude),
                    lng: parseFloat(values.longitude),
                  }}
                  handleClickOnMap={({ lat, lng }) => {
                    setFieldValue("latitude", lat);
                    setFieldValue("longitude", lng);
                  }}
                  containerElement={<div className="map-container" />}
                  mapElement={<div style={{ height: `300px` }} />}
                  googleMapURL={
                    "https://maps.googleapis.com/maps/api/js?key=AIzaSyB9TjZ738gEUOCYu0YJSjvSu18eVFJAHkQ&v=3.exp&libraries=geometry,drawing,places"
                  }
                  loadingElement={<div style={{ height: `300px` }} />}
                />
                <br />
                {facilityCategoryList.data &&
                !facilityCategoryList.isFetching ? (
                  <Field
                    component={AntSelect}
                    name="category"
                    label={t("form.category")}
                    defaultValue={values.category}
                    selectOptions={categoryList}
                    submitCount={submitCount}
                    selectKey="guid"
                    selectName="title"
                    loading={facilityCategoryList.isLoading}
                    // style={{ width: 200 }}
                    hasFeedback
                  />
                ) : null}
                <Field
                  component={AntSelect}
                  name="region"
                  label={t("form.region")}
                  defaultValue={values.region}
                  selectOptions={regionList}
                  submitCount={submitCount}
                  selectKey="id"
                  selectName="id"
                  loading={facilityCategoryList.isLoading}
                  // style={{ width: 200 }}
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
                  name={`closest_subway_station`}
                  type="text"
                  label={t("form.closest_subway_station")}
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
                  name={`bus_station`}
                  type="text"
                  label={t("form.bus_station")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`phone`}
                  type="text"
                  label={t("form.phone")}
                  hasFeedback
                />
                <Field
                  component={AntInput}
                  name={`capacity`}
                  type="text"
                  label={t("form.capacity")}
                  hasFeedback
                />
                <div>
                  <div>{t("form.working_hours_from")}</div>

                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "working_hour_from",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values.working_hour_from, "HH:mm")}
                    value={moment(values.working_hour_from, "HH:mm")}
                  />
                </div>
                <br />
                <div>
                  <div>{t("form.working_hours_to")}</div>

                  <TimePicker
                    onChange={(val) =>
                      setFieldValue(
                        "working_hour_to",
                        moment(val).format("HH:mm")
                      )
                    }
                    format="HH:mm"
                    defaultValue={moment(values.working_hour_to, "HH:mm")}
                    value={moment(values.working_hour_to, "HH:mm")}
                  />
                </div>
                <br />
                <Form.Item
                  name="working_days"
                  label={t("form.working_days")}
                  initialValue={moment(values.working_hour_to, "HH:mm")}
                >
                  <Space>
                    {daysArray.map((item, id) => {
                      const dayStatus =
                        _.get(values, ["days"]) &&
                        values.days.find((d) => d.day === item.day)
                          ? values.days.find((d) => d.day === item.day)
                              .is_working_day
                          : false;

                      const oldlist = _.get(values, ["days", "length"])
                        ? _.get(values, ["days"]).filter(
                            (d) => d.day !== item.day
                          )
                        : [];

                      return (
                        <Button
                          type={dayStatus ? "primary" : "dashed"}
                          key={id}
                          onClick={() =>
                            setFieldValue("days", [
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
                    loading={addFacilityInfo.isLoading}
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

export default FacilityDetailsPage;
