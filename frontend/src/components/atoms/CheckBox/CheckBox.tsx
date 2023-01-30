import React from "react";
import styled from "styled-components";
import Board from "../Board";
import Typography from "../Typography";

const CheckboxStyled = styled(Board).attrs({
  width: "79%",
  height: "100%",
  justifyContent: "space-around",
})``;
const CheckBoxLabel = styled.label`
  user-select: none;
  display: flex;
  align-items: center;
`;

const CheckBoxWrapper = styled.input.attrs({ type: "radio" })`
  appearance: none;
  width: 2rem;
  height: 2rem;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: limegreen;
  }
`;

interface Props {
  title: string;
  onClick?: (e: React.FormEvent<HTMLInputElement>) => void;
  defaultChecked: boolean;
}

const CheckBox = ({ title, defaultChecked, onClick }: Props) => {
  return (
    <CheckboxStyled>
      <CheckBoxLabel htmlFor={title} key={title}>
        <CheckBoxWrapper
          className="checkBox"
          onClick={onClick}
          defaultChecked={defaultChecked}
          id={title}
        />
        <Typography fontSize="2rem">{title}</Typography>
      </CheckBoxLabel>
    </CheckboxStyled>
  );
};

export default CheckBox;
