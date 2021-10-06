import React from "react";
import { Modal } from "antd";

const CustomModal = ({
  title,
  visible,
  onCancel,
  children,
  bodyStyle,
  footer,
  ...rest
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      maskClosable={false}
      destroyOnClose
      onCancel={() => onCancel && onCancel()}
      footer={footer}
      bodyStyle={bodyStyle}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
