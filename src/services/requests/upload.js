import api from "services/api";

const upload = (formData) => {
  return api.request.post("/media-storage/upload/image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default upload;
