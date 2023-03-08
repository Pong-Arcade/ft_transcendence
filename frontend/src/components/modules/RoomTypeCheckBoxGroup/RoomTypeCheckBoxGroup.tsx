import React from "react";
import {
  EChatRoomMode,
  EChatRoomFormValues,
} from "../../../hooks/useChatRoomForm";
import CheckBox from "../../atoms/CheckBox";
import InputLabel from "../../atoms/InputLabel";
import InputWrapper from "../../atoms/InputWrapper/InputWrapper";

interface Props {
  title: string;
  checked: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoomTypeCheckBoxGroup = ({ title, onChange, checked }: Props) => {
  const titleList = [
    EChatRoomMode.PUBLIC,
    EChatRoomMode.PROTECTED,
    EChatRoomMode.PRIVATE,
  ];
  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        {titleList.map((title) => (
          <CheckBox
            onChange={onChange}
            title={title}
            name={EChatRoomFormValues.MODE}
            checked={title === checked}
            key={title}
          />
        ))}
      </InputWrapper>
    </>
  );
};

export default RoomTypeCheckBoxGroup;
