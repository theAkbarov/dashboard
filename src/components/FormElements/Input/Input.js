import React, { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input as AntdInput, Form as AntdForm } from "antd";
import _ from "lodash";

const Input = ({
  name,
  label,
  className,
  password,
  arrayItem,
  icon: InputIcon,
  defaultValue,
  tab,
  changeTab,
  ...inputProps
}) => {
  const { errors, formState, control } = useFormContext();
  const error = errors?.name;
  const touched = formState.touched?.name;

  // const invalid = error;
  // const valid = touched && !error;

  return (
    <Fragment>
      <AntdForm.Item
        validateStatus={touched && error ? "error" : undefined}
        label={label}
        help={touched && error && error.message.replace(name, "")}
      >
        <Controller
          as={
            password ? (
              <AntdInput.Password {...inputProps} />
            ) : (
              <AntdInput {...inputProps} />
            )
          }
          name={name}
          control={control}
          defaultValue={defaultValue}
        />
      </AntdForm.Item>
    </Fragment>
  );
};

export default Input;
