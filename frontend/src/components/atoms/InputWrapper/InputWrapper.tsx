import React from "react";
import styled from "styled-components";
import Board from "../Board";

interface Props {
  children: React.ReactNode;
}

const InputWrapperStyled = styled(Board).attrs((props) => {
  return {
    width: "79.5%",
    height: "100%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})``;

const InputWrapper = ({ children }: Props) => {
  return <InputWrapperStyled>{children}</InputWrapperStyled>;
};

export default InputWrapper;
