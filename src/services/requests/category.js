import api from "services/api";

const category = {
  parental: {
    faq: {
      getAll: () =>
        api.request.get(
          `/admin/parental-informations/category-faq/?page_size=1000`
        ),
      getSingle: (id) =>
        api.request.get(`/admin/parental-informations/category/${id}/`),
      create: ({ data }) =>
        api.request.post(
          `/admin/parental-informations/category-faq/create/`,
          data
        ),
      update: ({ id, data }) =>
        api.request.put(
          `/admin/parental-informations/category/${id}/update/`,
          data
        ),
      delete: (id) =>
        api.request.delete(
          `/admin/parental-informations/category/${id}/delete/`
        ),
    },
    info: {
      getAll: () =>
        api.request.get(
          `/admin/parental-informations/category-infographics/?page_size=1000`
        ),
      getSingle: (id) =>
        api.request.get(`/admin/parental-informations/category/${id}/`),
      create: ({ data }) =>
        api.request.post(
          `/admin/parental-informations/category-infographics/create/`,
          data
        ),
      update: ({ id, data }) =>
        api.request.put(
          `/admin/parental-informations/category/${id}/update/`,
          data
        ),
      delete: (id) =>
        api.request.delete(
          `/admin/parental-informations/category/${id}/delete/`
        ),
    },
  },
  sport: {
    getAll: () => api.request.get(`/admin/sportcategory/?page_size=1000`),
    getSingle: (id) => api.request.get(`/admin/sportcategory/${id}/`),
    create: ({ data }) =>
      api.request.post(`/admin/sportcategory/create/`, data),
    update: ({ id, data }) =>
      api.request.put(`/admin/sportcategory/${id}/update/`, data),
    delete: (id) => api.request.delete(`/admin/sportcategory/${id}/delete/`),
  },
  videoblog: {
    getAll: () => api.request.get(`/admin/video_blog/category/?page_size=1000`),
    getSingle: (id) => api.request.get(`/admin/video_blog/category/${id}/`),
    create: ({ data }) =>
      api.request.post(`/admin/video_blog/category/create/`, data),
    update: ({ id, data }) =>
      api.request.put(`/admin/video_blog/category/${id}/update/`, data),
    delete: (id) =>
      api.request.delete(`/admin/video_blog/category/${id}/delete/`),
  },
  facility: {
    getAll: () => api.request.get(`/admin/facility/category/?page_size=1000`),
    getSingle: (id) => api.request.get(`/admin/facility/category/${id}/`),
    create: ({ data }) =>
      api.request.post(`/admin/facility/category/create/`, data),
    update: ({ id, data }) =>
      api.request.put(`/admin/facility/category/${id}/update/`, data),
    delete: (id) =>
      api.request.delete(`/admin/facility/category/${id}/delete/`),
  },
};

export default category;
