import React, { useState } from "react";
import styled from "styled-components";
import Board from "../../../components/ui/boards/Board";
import Button from "../../../components/ui/buttons/Button";
import List from "../../../components/ui/lists/List";
import ModalTitle from "../../../components/ui/modals/ModalTitle";

interface ICreateRoomModal {
  children: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Rows = styled(List)`
  height: 100%;
  background-color: ${(props) => props.theme.background.back};
  font-size: 2rem;
`;
const Row = styled(Board)`
  height: 23%;
  justify-content: space-between;
`;

const RowTitle = styled(Board)`
  background-color: ${(props) => props.theme.background.middle};
  height: 100%;
  width: 20%;
`;
const RowContext = styled.input`
  background-color: ${(props) => props.theme.background.middle};
  height: 100%;
  width: 79%;
  font-size: 2rem;
  border-radius: ${(props) => props.theme.border.board};
  padding: 1vw;
`;

const CreateButton = styled(Button).attrs({
  height: "8vh",
  width: "20vw",
  fontSize: "1.2rem",
})``;

const CheckBoxList = styled(Board)`
  width: 79%;
  height: 100%;
  justify-content: space-around;
  background-color: ${(props) => props.theme.background.middle};
`;
const CheckBoxLabel = styled.label`
  user-select: none;
  display: flex;
  align-items: center;
`;
const CheckBox = styled.input.attrs({ type: "radio" })`
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
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

const MaxPeopleBox = styled.input.attrs({
  type: "number",
  placeholder: "1 ~ 10 숫자만 입력하세요",
})`
  background-color: ${(props) => props.theme.background.middle};
  height: 100%;
  width: 79%;
  font-size: 2rem;
  border-radius: ${(props) => props.theme.border.board};
  padding: 1vw;
  text-align: center;

  &::placeholder {
    color: white;
  }
`;

const BlankBox = styled(Board)`
  background-color: ${(props) => props.theme.colors.chineseWhite};
  height: 100%;
  width: 79%;
`;

enum ECheckedType {
  Public = "Public",
  Protected = "Protected",
  Private = "Private",
}

const CreateRoomModal = ({ children, setOpenModal }: ICreateRoomModal) => {
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

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") return;
    if (Number(e.currentTarget.value) > 10) e.currentTarget.value = "10";
    else if (Number(e.currentTarget.value) < 1) e.currentTarget.value = "1";
  };

  return (
    <>
      <ModalTitle
        title={children}
        setOpenModal={setOpenModal}
        titleFontSize="2rem"
      />
      <Rows>
        <Row>
          <RowTitle>방유형</RowTitle>
          <CheckBoxList>
            {checkList.map((elem, idx) => (
              <CheckBoxLabel htmlFor={elem} key={idx}>
                <CheckBox
                  key={idx}
                  className="checkBox"
                  onClick={handleCheckedBox}
                  defaultChecked={elem === ECheckedType.Public ? true : false}
                  id={elem}
                />
                {elem}
              </CheckBoxLabel>
            ))}
          </CheckBoxList>
        </Row>
        <Row>
          <RowTitle>방제목</RowTitle>
          {checkedType !== ECheckedType.Private ? (
            <RowContext></RowContext>
          ) : (
            <BlankBox />
          )}
        </Row>
        <Row>
          <RowTitle>비밀번호</RowTitle>
          {checkedType === ECheckedType.Protected ? (
            <RowContext></RowContext>
          ) : (
            <BlankBox />
          )}
        </Row>
        <Row>
          <RowTitle>최대인원</RowTitle>
          <MaxPeopleBox onChange={handleOnChange}></MaxPeopleBox>
        </Row>
      </Rows>
      <CreateButton>생성</CreateButton>
    </>
  );
};

export default CreateRoomModal;
