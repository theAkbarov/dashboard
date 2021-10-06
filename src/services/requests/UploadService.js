import api from "services/api";

const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("image", file);

  return api.request.post("/media-storage/upload/image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const getFiles = () => {
  return api.request.get("/files");
};

export default {
  upload,
  getFiles,
};
