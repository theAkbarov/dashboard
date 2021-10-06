import {CHANGE_LANGUAGE} from "services/constants";

export const changeLanguage = (lang) => ({
    type: CHANGE_LANGUAGE,
    payload: lang
});
