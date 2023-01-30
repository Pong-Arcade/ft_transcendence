import React from "react";
import styled from "styled-components";

interface Props {
  width: string;
  height: string;
  backgroundColor?: string;
  boxShadow?: boolean;
  borderRadius?: boolean;
  color?: string;
  padding?: string;
  fontSize?: string;
  caretColor?: string;
}

const InputStyled = styled.input<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  border-radius: ${(props) => props.borderRadius && props.theme.border.board};
  color: ${(props) => props.color && props.color};
  padding: ${(props) => props.padding && props.padding};
  font-size: ${(props) => props.fontSize && props.fontSize};
  caret-color: ${(props) => props.caretColor || props.theme.background.front};
`;

const Input = ({ ...rest }: Props) => {
  return <InputStyled {...rest} />;
};

export default Input;
