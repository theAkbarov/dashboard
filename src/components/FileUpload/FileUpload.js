import { Upload, Modal } from "antd";
import { Fragment, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { requests } from "services/requests";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const FileUpload = () => {
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    progress: 0,
    fileList: [
      {
        uid: "-3",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
      {
        uid: "-4",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
      {
        uid: "-5",
        name: "image.png",
        status: "error",
      },
    ],
  });

  const handleCancel = () => {
    setState({
      ...state,
      previewVisible: false,
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChange = ({ fileList }) => {
    setState({
      ...state,
      fileList,
    });
  };

  const handleUpload = async (file) => {
    let currentFile = file;

    setState({
      ...state,
      progress: 0,
      currentFile,
    });

    requests
      .upload(currentFile, (event) => {
        setState({
          ...state,
          progress: Math.round((100 * event.loaded) / event.total),
          fileList: [
            ...fileList,
            {
              percent: Math.round((100 * event.loaded) / event.total),
              uid: currentFile.uid,
              name: currentFile.name,
              status: "uploading",
            },
          ],
        });
      })
      .then((response) => {
        const oldFileList = state.fileList.filter(
          (item) => item.uid !== currentFile.uid
        );
        let fileItem = state.fileList.find(
          (item) => item.uid === currentFile.uid
        );
        fileItem = fileItem
          ? {
              ...fileItem,
              status: "done",
            }
          : {};
        setState({
          ...state,
          fileList: [
            ...oldFileList,
            {
              percent: 0,
              uid: currentFile.uid,
              name: currentFile.name,
              status: "uploading",
            },
          ],
        });
        // setMessage(response.data.message);
        // return UploadService.getFiles();
        // })
        // .then((files) => {
        //   setFileInfos(files.data);
      })
      .catch(() => {
        setState({
          ...state,
          progress: 0,
          setCurrentFile: undefined,
        });

        // setMessage("Could not upload the file!");
        // setCurrentFile(undefined);
      });

    // setSelectedFiles(undefined);
  };

  const { previewVisible, previewImage, fileList, previewTitle } = state;
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Fragment>
      <Upload
        multiple
        action={handleUpload}
        listType="picture-card"
        fileList={[
          ...state.fileList,
          //   {
          //     uid: "-xxx",
          //     percent: state.progress,
          //     name: "image.png",
          //     status: "uploading",
          //     url:
          //       "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          //   },
        ]}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Fragment>
  );
};

export default FileUpload;
