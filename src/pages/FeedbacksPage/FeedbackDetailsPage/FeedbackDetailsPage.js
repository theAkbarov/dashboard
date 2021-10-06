import React, { Fragment } from "react";
import {
  Card,
  Descriptions,
  Badge,
  Skeleton,
  Button,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryCache } from "react-query";
import _ from "lodash";
import { requests } from "services/requests";

const { Meta } = Card;

const FeedbackDetailsPage = () => {
  const { t } = useTranslation();
  let params = useParams();
  let history = useHistory();
  let cashe = useQueryCache();

  const feedbackItem = useQuery(["feedback", params.id], () =>
    requests.feedbacks.getSingle(params.id)
  );

  // Mutations
  const [completeFeedback, completeFeedbackInfo] = useMutation(
    requests.feedbacks.update,
    {
      onSuccess: (mes) => {
        notification.success({
          message: t("notification.success.update"),
          placement: "topRight",
        });
        cashe.invalidateQueries(["feedback", params.id]);
        history.push("/feedback");
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
      {feedbackItem.isLoading ? (
        <Skeleton />
      ) : (
        <Fragment>
          <Descriptions
            title={t("sidebar.feedback")}
            layout="vertical"
            bordered
          >
            <Descriptions.Item label={t("form.full_name")} span={3}>
              {_.get(feedbackItem, ["data", "data", "full_name"])}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.phone_number")} span={3}>
              {_.get(feedbackItem, ["data", "data", "phone_number"])}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.description")} span={3}>
              {_.get(feedbackItem, ["data", "data", "description"])}
            </Descriptions.Item>
            <Descriptions.Item label={t("form.status")} span={3}>
              {_.get(feedbackItem, ["data", "data", "is_completed"]) ? (
                <Badge status="success" text={t("status.completed")} />
              ) : (
                <Badge status="processing" text={t("status.active")} />
              )}
            </Descriptions.Item>
          </Descriptions>
        </Fragment>
      )}
      <br />
      {!_.get(feedbackItem, ["data", "data", "is_completed"]) ? (
        <Button
          type="primary"
          loading={completeFeedbackInfo.isLoading}
          htmlType="submit"
          onClick={() =>
            completeFeedback({ id: params.id, data: { completed: true } })
          }
        >
          {t("action.mark")}
        </Button>
      ) : null}
    </Card>
  );
};

export default FeedbackDetailsPage;
