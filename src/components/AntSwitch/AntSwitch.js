import React, { Fragment } from "react";
import { Switch } from "antd";

const AntSwitch = ({ onChange, checked }) => {
  return (
    <Fragment>
      <Switch checked={checked} onChange={onChange} />
    </Fragment>
  );
};

export default AntSwitch;
