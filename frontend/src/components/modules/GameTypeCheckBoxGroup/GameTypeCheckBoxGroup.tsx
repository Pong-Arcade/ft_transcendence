import React from "react";
import {
  EGameRoomFormValues,
  EGameRoomMode,
} from "../../../hooks/useGameRoomForm";
import CheckBox from "../../atoms/CheckBox";
import InputLabel from "../../atoms/InputLabel";
import InputWrapper from "../../atoms/InputWrapper/InputWrapper";

interface Props {
  title: string;
  checked: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GameTypeCheckBoxGroup = ({ title, onChange, checked }: Props) => {
  const titleList = [EGameRoomMode.NORMAL, EGameRoomMode.POWER_UP];
  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        {titleList.map((title) => (
          <CheckBox
            onChange={onChange}
            title={title}
            name={EGameRoomFormValues.MODE}
            checked={title === checked}
            key={title}
          />
        ))}
      </InputWrapper>
    </>
  );
};

export default GameTypeCheckBoxGroup;
