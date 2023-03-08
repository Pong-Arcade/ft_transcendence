import React, { useEffect } from "react";
import ModalCloseButton from "../../atoms/ModalCloseButton";
import Title from "../Title";

interface Props {
  children?: React.ReactNode;
  height?: string;
  fontSize?: string;
  closeFontSize?: string;
  onClose?: () => void;
  exceptCloseButton?: boolean;
}

const ModalTitle = ({
  children,
  onClose,
  closeFontSize,
  exceptCloseButton,
  ...rest
}: Props) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });
  return (
    <Title {...rest}>
      {children}
      {!exceptCloseButton && (
        <ModalCloseButton fontSize={closeFontSize} onClose={onClose} />
      )}
    </Title>
  );
};

export default ModalTitle;
