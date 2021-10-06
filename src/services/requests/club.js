import api from "services/api";
import * as qs from "qs";

const club = {
  getAll: (query, facility) =>
    api.request.get(
      `/admin/facility/${facility}/sport_club/${qs.stringify(query, {
        addQueryPrefix: true,
      })}`
    ),
  getSingle: (id) => api.request.get(`/admin/facility/sport_club/${id}/`),
  create: ({ data }) =>
    api.request.post(`/admin/facility/sport_club/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/facility/sport_club/${id}/update/`, data),
  delete: (id) =>
    api.request.delete(`/admin/facility/sport_club/${id}/delete/`),
  user: {
    auth: {
      getAll: (query) =>
        api.request.get(
          `/admin/facility/sport_club/auth-user/${qs.stringify(query, {
            addQueryPrefix: true,
          })}`
        ),
      changeStatus: ({ id, status }) =>
        api.request.put(
          `/admin/facility/sport_club/auth-user/${id}/change-status/`,
          { status }
        ),
    },
    anon: {
      getAll: (query) =>
        api.request.get(
          `/admin/facility/sport_club/anonymous-user/${qs.stringify(query, {
            addQueryPrefix: true,
          })}`
        ),
      changeStatus: ({ id, status }) =>
        api.request.put(
          `/admin/facility/sport_club/anonymous-user/${id}/change-status/`,
          { status }
        ),
    },
  },
};

export default club;
