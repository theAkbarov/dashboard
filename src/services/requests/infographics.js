import api from "services/api";
import * as qs from "qs";

const infographics = {
  getAll: (query) =>
    api.request.get(
      `/admin/infographics/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/infographics/${id}/`),
  create: ({ data }) => api.request.post(`/admin/infographics/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/infographics/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/infographics/${id}/delete/`),
};

export default infographics;
