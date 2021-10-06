import api from "services/api";
import * as qs from "qs";

const faq = {
  getAll: (query) =>
    api.request.get(
      `/admin/faqs/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/faqs/${id}/`),
  create: ({ data }) => api.request.post(`/admin/faqs/create/`, data),
  update: ({ id, data }) => api.request.put(`/admin/faqs/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/faqs/${id}/delete/`),
};

export default faq;
