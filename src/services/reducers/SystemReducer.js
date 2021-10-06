import {
    CHANGE_LANGUAGE
} from "../constants";
import * as language from "constants/language";

const INITIAL_STATE = {
    language: language.defaultValue
};

export default (state = INITIAL_STATE, {payload, type}) => {
    switch (type) {
        case CHANGE_LANGUAGE:
            return {
                ...state,
                language:  payload
            };
        default:
            return state;
    }
};
