import api from "services/api";
import * as qs from "qs";

const feedbacks = {
  getAll: (query) =>
    api.request.get(
      `/admin/feedbacks/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/feedbacks/${id}/`),
  update: ({ id, data }) =>
    api.request.put(`/admin/feedbacks/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/feedbacks/${id}/delete/`),
};

export default feedbacks;
