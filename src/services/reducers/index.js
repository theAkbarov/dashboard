import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import { CLEAR_ON_SIGNOUT } from "services/constants";

import AuthReducer from "./AuthReducer";
import SystemReducer from "services/reducers/SystemReducer";

const appReducer = combineReducers({
  auth: AuthReducer,
  system: SystemReducer,
});

const rootReducer = (state, action) => {
  if (action.type === CLEAR_ON_SIGNOUT) {
    storage.removeItem("persist:kids-sport-admin");
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
