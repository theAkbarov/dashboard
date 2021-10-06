import {
  CLEAR_ON_SIGNOUT,
  REFRESH_ACCESS_TOKEN,
  SET_AUTH_TOKENS,
} from "services/constants";

export const setAuthTokens = (data) => ({
  type: SET_AUTH_TOKENS,
  payload: {
    accessToken: data && data.access,
    refreshToken: data && data.refresh,
  },
});

export const refreshAccessToken = (token) => ({
  type: REFRESH_ACCESS_TOKEN,
  payload: token,
});

// export const setAuthCredentials = (phoneNumber) => ({
//   type: SET_AUTH_CREDENTIALS,
//   payload: phoneNumber,
// });

export const logout = () => ({
  type: CLEAR_ON_SIGNOUT,
});
