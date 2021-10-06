import api from "services/api";

const auth = {
  login: (data) => api.request.post(`/auth/token/`, data),
};

export default auth;
