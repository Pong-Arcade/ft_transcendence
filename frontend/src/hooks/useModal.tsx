import { useState } from "react";
import { MouseEvent } from "react";

interface Props {
  beforeOpen?: (e?: MouseEvent<HTMLButtonElement>) => void;
  afterOpen?: (e?: MouseEvent<HTMLButtonElement>) => void;
  beforeClose?: (e?: MouseEvent<HTMLButtonElement>) => void;
  afterClose?: (e?: MouseEvent<HTMLButtonElement>) => void;
  beforeSubmit?: (e?: MouseEvent<HTMLButtonElement>) => void;
  afterSubmit?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

const useModal = ({
  beforeOpen,
  afterOpen,
  beforeClose,
  afterClose,
  beforeSubmit,
  afterSubmit,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onModalOpen = (e?: MouseEvent<HTMLButtonElement>) => {
    beforeOpen?.(e);
    setIsModalOpen(true);
    afterOpen?.(e);
  };
  const onModalClose = (e?: MouseEvent<HTMLButtonElement>) => {
    beforeClose?.(e);
    setIsModalOpen(false);
    afterClose?.(e);
  };
  const onSubmit = (e?: MouseEvent<HTMLButtonElement>) => {
    beforeSubmit?.(e);
    setIsModalOpen(false);
    afterSubmit?.(e);
  };
  return { isModalOpen, onModalOpen, onModalClose, onSubmit };
};

export default useModal;
