import React from "react";
import CloseButton from "../CloseButton";

interface Props {
  width?: string;
  height?: string;
  top?: string;
  right?: string;
  fontSize?: string;
  onClose?: () => void;
}

const ModalCloseButton = ({ onClose, ...rest }: Props) => {
  return <CloseButton {...rest} onClose={onClose} />;
};

export default ModalCloseButton;
