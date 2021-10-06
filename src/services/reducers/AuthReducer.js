import {
  CLEAR_ON_SIGNOUT,
  REFRESH_ACCESS_TOKEN,
  SET_AUTH_CREDENTIALS,
  SET_AUTH_TOKENS,
} from "../constants";

const INITIAL_STATE = {
  phoneNumber: "",
  accessToken: "",
  refreshToken: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH_CREDENTIALS:
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case SET_AUTH_TOKENS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case REFRESH_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      };
    case CLEAR_ON_SIGNOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
