import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
  backgroundColor?: string;
}

const ModalWrapperStyled = styled.div<Props>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "rgba(0, 0, 0, 0.75)"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = ({ children, onClose, ...rest }: Props) => {
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget === e.target) {
      onClose?.();
    }
  };
  return (
    <ModalWrapperStyled {...rest} onClick={onClick}>
      {children}
    </ModalWrapperStyled>
  );
};

export default ModalWrapper;
