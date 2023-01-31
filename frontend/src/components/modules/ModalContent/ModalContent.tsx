import React, { useState } from "react";
import styled from "styled-components";
import { ICreateRoomFormValues } from "../../../hooks/useCreateRoomForm";
import Board from "../../atoms/Board";
import CheckBox from "../../atoms/CheckBox";
import Input from "../../atoms/Input";

interface Props {
  titleList: string[];
  typeList: EContentType[];
  values: ICreateRoomFormValues;
  errors: ICreateRoomFormValues;
  onChangeForm: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModalContentStyled = styled(Board).attrs((props) => {
  return {
    width: "98%",
    height: props.height,
    borderRadius: true,
    justifyContent: "space-between",
  };
})``;

const ContentLabel = styled.label`
  width: 20%;
  height: 100%;
  background-color: ${(props) => props.theme.background.front};
  border-radius: ${(props) => props.theme.border.board};
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled(Board).attrs((props) => {
  return {
    width: "79%",
    height: "100%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})``;

export enum EContentType {
  RADIO = "radio",
  TITLE = "title",
  PASSWORD = "password",
  NUMBER = "number",
}

export enum ECheckedType {
  Public = "Public",
  Protected = "Protected",
  Private = "Private",
}

const InputBox = styled(Input).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    padding: "3rem",
    value: props.value && props.value,
    name: props.name && props.name,
  };
})``;

const NumberBox = styled(Input).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    padding: "3rem",
    placeholder: "1 ~ 10 숫자만 입력하세요",
    type: "number",
    value: props.value && props.value,
  };
})`
  text-align: center;
  &::placeholder {
    color: white;
  }
`;

const BlankBox = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.colors.chineseWhite,
    width: "100%",
    height: "100%",
    borderRadius: true,
  };
})``;

const ModalContent = ({
  titleList,
  typeList,
  values,
  // errors,
  onChangeForm,
}: Props) => {
  const [checkedType, setCheckedType] = useState<string>(ECheckedType.Public);
  const checkList = [
    ECheckedType.Public,
    ECheckedType.Protected,
    ECheckedType.Private,
  ];
  const handleCheckedBox = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.id === checkedType) return;
    const checkBoxList = document.getElementsByClassName("checkBox");
    Array.prototype.forEach.call(checkBoxList, (elem) => {
      elem.checked = false;
    });
    e.currentTarget.checked = true;
    setCheckedType(e.currentTarget.id);
  };

  return (
    <>
      {titleList.map((title, idx) => (
        <ModalContentStyled height={`${100 / titleList.length}%`} key={idx}>
          <ContentLabel htmlFor={title}>{title}</ContentLabel>
          <Content>
            {typeList[idx] === EContentType.RADIO &&
              checkList.map((title, idx) => {
                return (
                  <CheckBox
                    key={idx.toString()}
                    title={title}
                    defaultChecked={checkedType === title}
                    onClick={handleCheckedBox}
                    onChange={onChangeForm}
                    name="roomType"
                  />
                );
              })}
            {typeList[idx] === EContentType.TITLE &&
              (checkedType !== ECheckedType.Private ? (
                <InputBox
                  id={title}
                  name="roomTitle"
                  value={values.roomTitle}
                  onChange={onChangeForm}
                />
              ) : (
                <BlankBox />
              ))}
            {typeList[idx] === EContentType.PASSWORD &&
              (checkedType === ECheckedType.Protected ? (
                <InputBox
                  type="password"
                  name="roomPassword"
                  id={title}
                  // value={values.roomPassword}
                  onChange={onChangeForm}
                />
              ) : (
                <BlankBox />
              ))}
            {typeList[idx] === EContentType.NUMBER && (
              <NumberBox
                name="maxUser"
                id={title}
                value={values.maxUser}
                onChange={onChangeForm}
              />
            )}
          </Content>
        </ModalContentStyled>
      ))}
    </>
  );
};

export default ModalContent;
