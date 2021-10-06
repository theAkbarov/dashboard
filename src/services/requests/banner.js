import api from "services/api";
import * as qs from "qs";

const banner = {
  getAll: (query) =>
    api.request.get(
      `/admin/homepage/banner/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/homepage/banner/${id}/detail/`),
  create: ({ data }) =>
    api.request.post(`/admin/homepage/banner/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/homepage/banner/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/homepage/banner/${id}/delete/`),
};

export default banner;
