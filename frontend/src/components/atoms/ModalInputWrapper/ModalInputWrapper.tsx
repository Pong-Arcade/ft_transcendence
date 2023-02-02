import React from "react";
import styled from "styled-components";
import Board from "../Board";

interface Props {
  children: React.ReactNode;
  height?: string;
}

const ModalInputWrapperStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: props.height || "100%",
    borderRadius: true,
    justifyContent: "space-between",
  };
})``;

const ModalInputWrapper = ({ children, ...rest }: Props) => {
  return (
    <ModalInputWrapperStyled {...rest}>{children}</ModalInputWrapperStyled>
  );
};

export default ModalInputWrapper;
