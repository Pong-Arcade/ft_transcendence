import React from "react";
import styled, { css } from "styled-components";
import Input from "../../atoms/Input";
import InputLabel from "../../atoms/InputLabel";
import InputWrapper from "../../atoms/InputWrapper/InputWrapper";

type InputType = "text" | "password" | "number";
interface Props {
  title: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: InputType;
  placeholder?: string;
  defaultValue?: string;
}

const LabledInputStyled = styled(Input).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    padding: "1.5rem",
    value: props.value && props.value,
    name: props.name && props.name,
    type: props.type || "text",
    placeholder: props.placeholder && props.placeholder,
  };
})`
  width: 100%;
  height: 100%;
  ${(props) =>
    props.type === "number" &&
    css`
      text-align: center;
    `}
  &::placeholder {
    color: transparent;
  }
`;

const LabledInput = ({
  title,
  name,
  value,
  onChange,
  disabled,
  type,
  placeholder,
  defaultValue,
}: Props) => {
  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        <LabledInputStyled
          id={title}
          name={name}
          value={disabled ? "" : value}
          onChange={onChange}
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </InputWrapper>
    </>
  );
};

export default LabledInput;
