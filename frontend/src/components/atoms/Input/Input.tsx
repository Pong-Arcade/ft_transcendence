import React from "react";
import styled from "styled-components";

interface Props {
  width?: string;
  height?: string;
  backgroundColor?: string;
  boxShadow?: boolean;
  borderRadius?: boolean;
  color?: string;
  padding?: string;
  fontSize?: string;
  caretColor?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const InputStyled = styled.input.attrs((props) => {
  return {
    type: props.type || "text",
    placeholder: props.placeholder && props.placeholder,
    id: props.id && props.id,
    value: props.value && props.value,
  };
})<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  border-radius: ${(props) => props.borderRadius && props.theme.border.board};
  color: ${(props) => props.color && props.color};
  padding: ${(props) => props.padding && props.padding};
  font-size: ${(props) => props.fontSize || "3rem"};
  caret-color: ${(props) => props.caretColor || props.theme.background.front};
`;

const Input = ({ ...rest }: Props) => {
  return <InputStyled {...rest} />;
};

export default Input;
