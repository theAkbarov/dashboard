import * as yup from "yup";

export const langValidation = (obj) => {
  return yup.object({
    // ru: yup.object().shape(obj),
    "uz-Latn": yup.object().shape(obj),
    "uz-Cyrl": yup.object().shape(obj),
    en: yup.object().shape(obj),
  });
};
