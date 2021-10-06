import api from "services/api";

const about = {
  getInfo: () => api.request.get(`/admin/about-us/`),
  update: (data) => api.request.put(`/admin/about-us/update/`, data),
};

export default about;
