import api from "services/api";
import * as qs from "qs";

const facility = {
  getAll: (query) =>
    api.request.get(
      `/admin/facility/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getAllList: (query) => api.request.get(`/admin/facility/?page_size=1000`),
  getSingle: (id) => api.request.get(`/admin/facility/${id}/`),
  create: ({ data }) => api.request.post(`/admin/facility/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/facility/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/facility/${id}/delete/`),
};

export default facility;
