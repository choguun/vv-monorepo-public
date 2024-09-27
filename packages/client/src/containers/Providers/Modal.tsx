import React, { useState, ReactNode } from "react";

import { ModalContext } from "../../contexts/modal";

export const ModalProvider = ({
  children,
  ...rest
}: {
  children: ReactNode;
}) => {
  const [content, setContent] = useState<ReactNode | null>(null);

  const openModal = (content: ReactNode) => setContent(content);
  const closeModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, content }} {...rest}>
      {children}
    </ModalContext.Provider>
  );
};
