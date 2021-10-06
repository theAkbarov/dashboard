import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { forwardRef, Fragment, useState } from "react";
import { requests } from "services/requests";
import { showNotification } from "utils/showNotification";

const AvatarUpload = ({ imageUrl, setImageUrl, touched, error }) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUpload = async ({ file }) => {
    try {
      setLoading(true);
      setImageUrl("");
      const formData = new FormData();
      formData.append("image", file);
      const response = await requests.upload(formData);
      setImageUrl(response && response.data && response.data.image);
      setLoading(false);
    } catch {
      setLoading(false);
      showNotification("error", "Error uploading file", "", 5000);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </div>
  );

  return (
    <Fragment>
      <Upload
        name="image"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
      {error && touched && <span className="error-text">{error}</span>}
    </Fragment>
  );
};

export default AvatarUpload;
