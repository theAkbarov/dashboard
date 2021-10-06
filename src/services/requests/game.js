import api from "services/api";
import * as qs from "qs";

const game = {
  question: {
    getAll: (query) =>
      api.request.get(
        `/admin/game/question/${qs.stringify(query, { addQueryPrefix: true })}`
      ),
    create: ({ data }) =>
      api.request.post(`/admin/game/question/create/`, data),
    getSingle: (id) =>
      api.request.get(`/admin/game/question/${id}/with_answers/`),
    update: ({ id, data }) =>
      api.request.put(`/admin/game/question/${id}/update/`, data),
    delete: (id) => api.request.delete(`/admin/game/question/${id}/delete/`),
  },
  answer: {
    getAll: (query) =>
      api.request.get(
        `/admin/game/answer/${qs.stringify(query, { addQueryPrefix: true })}`
      ),
    create: ({ data }) => api.request.post(`/admin/game/answer/create/`, data),
    getSingle: (id) => api.request.get(`/admin/game/answer/${id}/`),
    update: ({ id, data }) =>
      api.request.put(`/admin/game/answer/${id}/update/`, data),
    delete: (id) => api.request.delete(`/admin/game/answer/${id}/delete/`),
  },
};

export default game;
