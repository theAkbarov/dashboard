import api from "services/api";

const sportcategory = {
  getAll: () => api.request.get(`/admin/sportcategory/`),
  getSingle: (id) => api.request.get(`/admin/sportcategory/${id}/`),
  create: ({ data }) => api.request.post(`/admin/sportcategory/create/`, data),
  update: ({ id, data }) =>
    api.request.put(`/admin/sportcategory/${id}/update/`, data),
  delete: (id) => api.request.delete(`/admin/sportcategory/${id}/delete/`),
};

export default sportcategory;
