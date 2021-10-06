import axios from "axios";
import _ from "lodash";

import config from "./config";
import { logout, refreshAccessToken } from "services/actions";

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

const onAccessTokenFetched = (access_token) => {
  subscribers = subscribers.filter((callback) => callback(access_token));
};

const addSubscriber = (callback) => {
  subscribers.push(callback);
};

const request = axios.create({
  baseURL: config.URL,
});

const subscribe = (store) => {
  request.interceptors.request.use((config) => {
    let state = store.getState();
    const { accessToken } = state && state.auth;
    const { language } = state && state.system;

    config.headers["Content-Language"] = language;
    if (accessToken) {
      config.headers["Authorization"] = ["Bearer", accessToken].join(" ");
    }

    return config;
  });

  request.interceptors.response.use(
    (config) => config,
    (error) => {
      let state = store.getState();
      const { refreshToken } = state && state.auth;
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;
      if (status === 403) {
        store.dispatch(logout());
        throw error;
      }
      if (status === 401) {
        if (config && config.url === "/auth/token/refresh/") {
          store.dispatch(logout());
          return;
        }
        if (config && config.url === "/auth/token/") {
          throw error;
        }
        if (!isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true;
          refToken(refreshToken)
            .then((access_token, error) => {
              isAlreadyFetchingAccessToken = false;
              onAccessTokenFetched(access_token);
            })
            .catch(() => {
              store.dispatch(logout());
            });
        }
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber((res, err) => {
            const newToken = _.get(res, ["data", "access"]);

            store.dispatch(refreshAccessToken(newToken));
            originalRequest.headers.Authorization = "Bearer " + newToken;
            resolve(axios(originalRequest));
          });
        });
        return retryOriginalRequest.catch();
      }
      // return Promise.reject(error);

      throw error;
    }
  );
};

const refToken = (refreshToken) => {
  return request.post("/auth/token/refresh/", {
    refresh: refreshToken,
  });
};

export default { request, subscribe };
