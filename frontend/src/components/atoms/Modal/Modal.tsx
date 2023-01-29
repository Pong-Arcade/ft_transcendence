import React from "react";
import styled from "styled-components";
import Board from "../Board";

interface Props {
  children: React.ReactNode;
  width: string;
  height: string;
  backgroundColor?: string;
}

const ModalStyled = styled(Board).attrs((props) => {
  return {
    width: props.width,
    height: props.height,
    backgroundColor: props.backgroundColor || props.theme.colors.freshAir,
    borderRadius: true,
    flexDirection: "column",
    justifyContent: "space-between",
  };
})`
  position: absolute;
`;

const Modal = ({ children, ...rest }: Props) => {
  return <ModalStyled {...rest}>{children}</ModalStyled>;
};

export default Modal;
