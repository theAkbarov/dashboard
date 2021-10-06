import React, { Fragment } from "react";
import {
  Form as AntdForm,
  Input as AntdInput,
  Switch as AntdSwitch,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";

const Switch = ({
  name,
  label,
  leftLabel,
  checked,
  className,
  password,
  icon: InputIcon,
  defaultValue,
  ...inputProps
}) => {
  const { errors, formState, control, register, setValue } = useFormContext();
  const error = name && errors[name];
  const touched = name && formState.touched[name];

  const invalid = error;
  const valid = touched && !error;

  return (
    <Fragment>
      {label}
      <AntdForm.Item
        validateStatus={touched && error ? "error" : undefined}
        label={leftLabel}
        help={touched && error && error.message}
      >
        <AntdSwitch
          checked={checked}
          onChange={(check) => setValue(name, check)}
          ref={register}
          name={name}
          {...inputProps}
        />
      </AntdForm.Item>
    </Fragment>
  );
};

export default Switch;
