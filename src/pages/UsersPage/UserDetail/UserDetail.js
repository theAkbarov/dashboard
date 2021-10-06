import React, { Fragment } from "react";
import {
  Card,
  Descriptions,
  Badge,
  Skeleton,
  Button,
  notification,
  Switch,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryCache } from "react-query";
import _ from "lodash";
import { requests } from "services/requests";

const { Meta } = Card;

const UserDetail = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();

  const userItem = useQuery(["user", params.id], () =>
    requests.user.getSingle(params.id)
  );

  // Mutations
  const [toggleStaff, toggleStaffInfo] = useMutation(
    requests.user.toggleStaff,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.update"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["user", params.id]);
      },
      onError: () => {
        notification.error({
          message: t("notification.error.general"),
          placement: "topRight",
        });
      },
    }
  );

  return (
    <Card>
      {userItem.isLoading ? (
        <Skeleton />
      ) : (
        <Fragment>
          {userItem?.data?.data?.profile_image ? (
            <div style={{ height: "5rem", width: "5rem" }}>
              <img
                src={userItem?.data?.data?.profile_image}
                alt="profile_image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  margin: "0 auto",
                }}
              />
            </div>
          ) : null}
          <Descriptions title={t("form.user")} layout="vertical" bordered>
            <Descriptions.Item label={t("form.phone_number")} span={3}>
              {_.get(userItem, ["data", "data", "phone_number"]) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.first_name")} span={3}>
              {_.get(userItem, ["data", "data", "first_name"]) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.last_name")} span={3}>
              {_.get(userItem, ["data", "data", "last_name"]) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.email")} span={3}>
              {_.get(userItem, ["data", "data", "email"]) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.gender")} span={3}>
              {userItem?.data?.data?.gender !== "UNKNOWN" ? (
                <Fragment>
                  {userItem?.data?.data?.gender === "MALE"
                    ? t("gender.male")
                    : t("gender.female")}
                </Fragment>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.date_of_birth")} span={3}>
              {_.get(userItem, ["data", "data", "date_of_birth"]) || "-"}
            </Descriptions.Item>

            <Descriptions.Item label={t("form.date_joined")} span={3}>
              {_.get(userItem, ["data", "data", "date_joined"]) || "-"}
            </Descriptions.Item>

            <Descriptions.Item label={t("form.is_staff")} span={3}>
              <Switch
                checked={userItem?.data?.data?.is_staff}
                loading={toggleStaffInfo?.isLoading}
                onChange={(checked) => {
                  toggleStaff({
                    id: userItem?.data?.data?.guid,
                    status: checked,
                  });
                }}
                disabled={toggleStaffInfo?.isLoading}
              />
            </Descriptions.Item>
          </Descriptions>
        </Fragment>
      )}
    </Card>
  );
};

export default UserDetail;
