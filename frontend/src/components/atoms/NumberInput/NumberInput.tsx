import React from "react";
import styled from "styled-components";
import Input from "../Input";
import InputLabel from "../InputLabel";
import InputWrapper from "../InputWrapper/InputWrapper";

interface Props {
  title: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberInputStyled = styled(Input).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    padding: "1.5rem",
    placeholder: "2 ~ 10 숫자만 입력하세요",
    type: "number",
    value: props.value && props.value,
  };
})`
  text-align: center;
  &::placeholder {
    color: white;
  }
`;

const NumberInput = ({ title, name, value, onChange }: Props) => {
  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        <NumberInputStyled
          id={title}
          name={name}
          value={value}
          onChange={onChange}
        />
      </InputWrapper>
    </>
  );
};

export default NumberInput;
