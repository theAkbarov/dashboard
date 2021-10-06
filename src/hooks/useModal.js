import React, { useState } from "react";

const useModal = (initialMode = false) => {
  const [modalOpen, setModalOpen] = useState(initialMode);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const toggle = () => setModalOpen(!modalOpen);

  return {
    open,
    close,
    toggle,
    isActive: modalOpen,
  };
};

export default useModal;
