import React from "react";
import styled from "styled-components";
import DisabledInput from "../DisabledInput";
import Input from "../Input";
import InputLabel from "../InputLabel";
import InputWrapper from "../InputWrapper/InputWrapper";

interface Props {
  title: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const PasswordInputStyled = styled(Input).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    padding: "1.5rem",
    value: props.value && props.value,
    name: props.name && props.name,
    type: "password",
  };
})`
  width: 100%;
  height: 100%;
`;

const PasswordInput = ({ title, name, value, onChange, disabled }: Props) => {
  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        {disabled ? (
          <DisabledInput />
        ) : (
          <PasswordInputStyled
            id={title}
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
      </InputWrapper>
    </>
  );
};

export default PasswordInput;
