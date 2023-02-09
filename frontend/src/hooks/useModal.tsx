import { useState } from "react";

interface Props {
  beforeOpen?: () => void;
  afterOpen?: () => void;
  beforeClose?: () => void;
  afterClose?: () => void;
  beforeSubmit?: () => void;
  afterSubmit?: () => void;
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
  const onModalOpen = () => {
    beforeOpen?.();
    setIsModalOpen(true);
    afterOpen?.();
  };
  const onModalClose = () => {
    beforeClose?.();
    setIsModalOpen(false);
    afterClose?.();
  };
  const onSubmit = () => {
    beforeSubmit?.();
    setIsModalOpen(false);
    afterSubmit?.();
  };
  return { isModalOpen, onModalOpen, onModalClose, onSubmit };
};

export default useModal;
