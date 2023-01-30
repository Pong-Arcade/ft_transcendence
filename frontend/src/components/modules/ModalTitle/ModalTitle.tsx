import React from "react";
import ModalCloseButton from "../../atoms/ModalCloseButton";
import Title from "../Title";

interface Props {
  children: React.ReactNode;
  height?: string;
  fontSize?: string;
  closeFontSize?: string;
  onClose?: () => void;
}

const ModalTitle = ({ children, onClose, closeFontSize, ...rest }: Props) => {
  return (
    <Title {...rest}>
      {children}
      <ModalCloseButton fontSize={closeFontSize} onClose={onClose} />
    </Title>
  );
};

export default ModalTitle;
