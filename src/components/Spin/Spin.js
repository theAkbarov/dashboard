import React from "react";

import { Spin as AntSpin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const defaultProps = {
  spinning: false,
};

function Spin(props) {
  const { children, spinning } = props;

  const indicator = <LoadingOutlined spin />;

  return <AntSpin {...{ indicator, spinning }}>{children}</AntSpin>;
}

Spin.defaultProps = defaultProps;

export default Spin;
