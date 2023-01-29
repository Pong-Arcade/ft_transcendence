import React, { useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import CheckBox from "../../atoms/CheckBox";

interface Props {
  titleList: string[];
  typeList: EContentType[];
}

const ModalContentStyled = styled(Board).attrs({
  width: "98%",
  height: "24%",
  borderRadius: true,
  justifyContent: "space-between",
})``;

const ContentTitle = styled(Board).attrs((props) => {
  return {
    width: "20%",
    height: "100%",
    backgroundColor: props.theme.background.front,
    borderRadius: true,
  };
})`
  font-size: 2rem;
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

enum ECheckedType {
  Public = "Public",
  Protected = "Protected",
  Private = "Private",
}

const InputBox = styled.input`
  width: 100%;
  height: 100%;
  font-size: 3rem;
  border-radius: ${(props) => props.theme.border.board};
  background-color: ${(props) => props.theme.background.middle};
  padding: 3rem;
`;

const NumberBox = styled.input.attrs({
  type: "number",
  placeholder: "1 ~ 10 숫자만 입력하세요",
})`
  width: 100%;
  height: 100%;
  font-size: 3rem;
  border-radius: ${(props) => props.theme.border.board};
  background-color: ${(props) => props.theme.background.middle};
  padding: 3rem;
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

const ModalContent = ({ titleList, typeList }: Props) => {
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

  const OnChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") return;
    if (Number(e.currentTarget.value) > 10) e.currentTarget.value = "10";
    else if (Number(e.currentTarget.value) < 1) e.currentTarget.value = "1";
  };

  return (
    <>
      {titleList.map((title, idx) => (
        <ModalContentStyled>
          <ContentTitle>{title}</ContentTitle>
          <Content>
            {typeList[idx] === EContentType.RADIO &&
              checkList.map((title, idx) => {
                return (
                  <CheckBox
                    key={idx.toString()}
                    title={title}
                    defaultChecked={checkedType === title}
                    onClick={handleCheckedBox}
                  />
                );
              })}
            {typeList[idx] === EContentType.TITLE &&
              (checkedType !== ECheckedType.Private ? (
                <InputBox />
              ) : (
                <BlankBox />
              ))}
            {typeList[idx] === EContentType.PASSWORD &&
              (checkedType === ECheckedType.Protected ? (
                <InputBox />
              ) : (
                <BlankBox />
              ))}
            {typeList[idx] === EContentType.NUMBER && (
              <NumberBox onChange={OnChange} />
            )}
          </Content>
        </ModalContentStyled>
      ))}
    </>
  );
};

export default ModalContent;
