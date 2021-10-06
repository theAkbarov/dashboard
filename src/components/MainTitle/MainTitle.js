import React from "react";
import { Button, Card, Row } from "antd";

const MainTitle = ({
  title,
  button,
  onButtonClick,
  buttonType,
  buttonLoading,
  children,
}) => {
  return (
    <Card>
      <Row justify="space-between" className="news-table-row">
        <h2>{title}</h2>
        {button ? (
          <div>
            <Button
              onClick={() => onButtonClick && onButtonClick()}
              type={buttonType || "primary"}
              loading={buttonLoading ? buttonLoading : false}
            >
              {button}
            </Button>
          </div>
        ) : null}
      </Row>
      {children}
    </Card>
  );
};

export default MainTitle;
