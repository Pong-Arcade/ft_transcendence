import React from "react";
import styled from "styled-components";

const InputLabelStyled = styled.label`
  width: 20%;
  height: 100%;
  background-color: ${(props) => props.theme.background.front};
  border-radius: ${(props) => props.theme.border.board};
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  children: React.ReactNode;
  htmlFor: string;
}

const InputLabel = ({ children, htmlFor }: Props) => {
  return <InputLabelStyled htmlFor={htmlFor}>{children}</InputLabelStyled>;
};
export default InputLabel;
