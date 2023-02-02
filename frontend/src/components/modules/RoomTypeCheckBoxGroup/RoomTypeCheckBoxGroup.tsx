import React from "react";
import { ECreateRoomFormValues } from "../../../hooks/useCreateRoomForm";
import CheckBox from "../../atoms/CheckBox";
import InputLabel from "../../atoms/InputLabel";
import InputWrapper from "../../atoms/InputWrapper/InputWrapper";

export enum ERoomTypeCheckBoxTitle {
  PUBLIC = "Public",
  PROTECTED = "Protected",
  PRIVATE = "Private",
}

interface Props {
  title: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const titleList = [
  ERoomTypeCheckBoxTitle.PUBLIC,
  ERoomTypeCheckBoxTitle.PROTECTED,
  ERoomTypeCheckBoxTitle.PRIVATE,
];

const RoomTypeCheckBoxGroup = ({ title, onChange }: Props) => {
  const [checkedType, setCheckedType] = React.useState<string>(
    ERoomTypeCheckBoxTitle.PUBLIC
  );
  const onClick = (e: React.FormEvent<HTMLInputElement>) => {
    setCheckedType(e.currentTarget.value);
  };

  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <InputWrapper>
        {titleList.map((title, idx) => (
          <CheckBox
            onChange={onChange}
            onClick={onClick}
            title={title}
            name={ECreateRoomFormValues.TYPE}
            checked={title === checkedType}
            key={idx}
          />
        ))}
      </InputWrapper>
    </>
  );
};

export default RoomTypeCheckBoxGroup;
