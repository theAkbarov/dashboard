import React, { forwardRef, Fragment, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import _ from "lodash";

import WYSIWYGEditor from "components/WYSIWYGEditor";

const Editor = ({ name, label, className, defaultValue, toolbarOptions }) => {
  const { errors, formState, control } = useFormContext();
  const error = errors?.name;
  const touched = formState?.touched?.name;

  const invalid = error;
  const valid = touched && !error;

  return (
    <Fragment>
      {label}
      <Controller
        as={<WYSIWYGEditor toolbarOptions={toolbarOptions} />}
        name={name}
        control={control}
        defaultValue=""
      />
      {error && error.message.replace(name, "")}
      <br />
    </Fragment>
  );
};

Editor.defaultProps = {
  toolbarOptions: {
    options: [
      "inline",
      "link",
      "colorPicker",
      "list",
      "textAlign",
      "history",
      "remove",
    ],
  },
};

export default Editor;
