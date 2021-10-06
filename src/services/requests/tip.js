import api from "services/api";
import * as qs from "qs";

const tip = {
  getAll: (query) =>
    api.request.get(
      `/admin/homepage/tip/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/homepage/tip/${id}/detail/`),
  create: ({ data }) => api.request.post(`/admin/homepage/tip/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/homepage/tip/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/homepage/tip/${id}/delete/`),
};

export default tip;
