import api from "services/api";
import * as qs from "qs";

const videoblog = {
  getAll: (query) =>
    api.request.get(
      `/admin/video_blog/${qs.stringify(query, { addQueryPrefix: true })}`
    ),
  getSingle: (id) => api.request.get(`/admin/video_blog/${id}/`),
  create: ({ data }) => api.request.post(`/admin/video_blog/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/video_blog/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/video_blog/${id}/delete/`),
};

export default videoblog;
