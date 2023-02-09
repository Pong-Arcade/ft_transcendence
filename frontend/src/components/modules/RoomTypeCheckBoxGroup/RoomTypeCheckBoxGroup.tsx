import React from "react";
import { ECreateRoomFormValues } from "../../../hooks/useCreateRoomForm";
import CheckBox from "../../atoms/CheckBox";
import InputLabel from "../../atoms/InputLabel";
import InputWrapper from "../../atoms/InputWrapper/InputWrapper";

interface Props {
  title: string;
  checked: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum EChatRoomType {
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
  PRIVATE = "PRIVATE",
}

const titleList = [
  EChatRoomType.PUBLIC,
  EChatRoomType.PROTECTED,
  EChatRoomType.PRIVATE,
];

const RoomTypeCheckBoxGroup = ({ title, onChange, checked }: Props) => {
  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        {titleList.map((title, idx) => (
          <CheckBox
            onChange={onChange}
            title={title}
            name={ECreateRoomFormValues.TYPE}
            checked={title === checked}
            key={idx}
          />
        ))}
      </InputWrapper>
    </>
  );
};

export default RoomTypeCheckBoxGroup;
