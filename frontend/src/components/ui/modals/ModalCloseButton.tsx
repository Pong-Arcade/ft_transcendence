import React from "react";
import CloseButton from "../buttons/CloseButton";

interface IModalCloseButton {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalCloseButton = ({ setOpenModal }: IModalCloseButton) => {
  return <CloseButton onClick={() => setOpenModal(false)}>X</CloseButton>;
};

export default ModalCloseButton;
