import api from "services/api";
import * as qs from "qs";

const dictionary = {
  getAll: (query) =>
    api.request.get(
      `/admin/dictionary/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/dictionary/${id}/`),
  create: ({ data }) => api.request.post(`/admin/dictionary/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/dictionary/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/dictionary/${id}/delete/`),
};

export default dictionary;
