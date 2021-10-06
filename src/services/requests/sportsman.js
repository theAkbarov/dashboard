import api from "services/api";
import * as qs from "qs";

const sportsman = {
  getAll: (query) =>
    api.request.get(
      `/admin/sportsman/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/sportsman/${id}/`),
  create: ({ data }) => api.request.post(`/admin/sportsman/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/sportsman/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/sportsman/${id}/delete/`),
};

export default sportsman;
