import React, { forwardRef, Fragment, useEffect } from "react";
import { Form as AntdForm, Input as AntdInput } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import WYSIWYGEditor from "components/WYSIWYGEditor";
import _ from "lodash";
import AvatarUpload from "components/AvatarUpload/AvatarUpload";

const PhotoUpload = ({
  name,
  label,
  className,
  defaultValue,
  toolbarOptions,
}) => {
  const { errors, formState, control, register } = useFormContext();
  const error = errors?.name;
  const touched = formState?.touched?.name;

  const invalid = error;
  const valid = touched && !error;

  return (
    <Fragment>
      {label}
      <Controller
        as={<AvatarUpload />}
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
      {error && error.message.replace(name, "")}
      <br />
    </Fragment>
  );
};

export default PhotoUpload;
