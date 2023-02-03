import React from "react";
import styled, { css } from "styled-components";
import Board from "../Board";

interface Props {
  children: React.ReactNode;
  width: string;
  height: string;
  backgroundColor?: string;
  animation?: boolean;
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
})<Props>`
  position: absolute;

  ${(props) =>
    props.animation &&
    css`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      animation: fadeIn 0.5s ease-in;
    `}
`;

const Modal = ({ children, ...rest }: Props) => {
  return <ModalStyled {...rest}>{children}</ModalStyled>;
};

export default Modal;
