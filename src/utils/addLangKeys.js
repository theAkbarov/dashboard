import _ from "lodash";

export const addLangKeys = (obj) => {
  const langKeys = Object.keys(obj);
  const arr = _.values(obj);

  return arr.map((item, id) => {
    return {
      ...item,
      language: langKeys[id],
    };
  });
};

export const loadLangKeys = (arr) => {
  if (!arr || !arr.length) return null;
  return {
    ru: arr.find((item) => item.language === "ru"),
    "uz-Cyrl": arr.find((item) => item.language === "uz-Cyrl"),
    "uz-Latn": arr.find((item) => item.language === "uz-Latn"),
    en: arr.find((item) => item.language === "en"),
  };
};
