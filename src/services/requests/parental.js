import api from "services/api";
import * as qs from "qs";

const parental = {
  faq: {
    getAll: (data) =>
      api.request.get(
        `/admin/parental-informations/category/${
          data && data.category
        }/faq/${qs.stringify(data && data.page, { addQueryPrefix: true })}`
      ),
    getSingle: (id) =>
      api.request.get(`/admin/parental-informations/faq/${id}/`),
    create: ({ data }) =>
      api.request.post(`/admin/parental-informations/faq/create/`, data),
    update: ({ id, data }) =>
      api.request.put(`/admin/parental-informations/faq/${id}/update/`, data),
    delete: (id) =>
      api.request.delete(`/admin/parental-informations/faq/${id}/delete/`),
  },
  info: {
    getAll: (data) =>
      api.request.get(
        `/admin/parental-informations/category/${
          data && data.category
        }/infographics/${qs.stringify(data && data.page, {
          addQueryPrefix: true,
        })}`
      ),
    getSingle: (id) =>
      api.request.get(`/admin/parental-informations/infographics/${id}/`),
    create: ({ data }) =>
      api.request.post(
        `/admin/parental-informations/infographics/create/`,
        data
      ),
    update: ({ id, data }) =>
      api.request.put(
        `/admin/parental-informations/infographics/${id}/update/`,
        data
      ),
    delete: (id) =>
      api.request.delete(
        `/admin/parental-informations/infographics/${id}/delete/`
      ),
  },
};

export default parental;
