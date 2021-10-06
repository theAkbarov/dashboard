import api from "services/api";
import * as qs from "qs";

const user = {
  getAll: (query) =>
    api.request.get(
      `/account/users-list/${qs.stringify(query, {
        addQueryPrefix: true,
      })}`
    ),
  getSingle: (id) => api.request.get(`/account/${id}/`),
  toggleStaff: ({ id, status }) =>
    api.request.post(`/account/${id}/user-toggle/`, {
      is_staff: status,
    }),
};

export default user;
