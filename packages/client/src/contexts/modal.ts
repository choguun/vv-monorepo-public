import { createContext, ReactNode } from "react";

type ModalContextType = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  content: ReactNode | null;
};

export const ModalContext = createContext<ModalContextType>({} as any);
