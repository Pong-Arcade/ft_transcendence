import React from "react";
import styled, { css } from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import { ERoomCreateButtonName } from "../LobbyCreateRoomButtons/LobbyCreateRoomButtons";
import ModalContent from "../ModalContent";
import { EContentType } from "../ModalContent/ModalContent";
import ModalTitle from "../ModalTitle";
import useCreateRoomForm from "../../../hooks/useCreateRoomForm";
import createRoomFormValidate from "../../../utils/createRoomFormValidate";

interface Props {
  buttonType: string;
  onClose?: () => void;
}

const ModalContentWrapper = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: props.height || "72%",
    borderRadius: true,
    boxShadow: false,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})`
  gap: 0.1vh;
`;

const SubmitButton = styled(Button).attrs((props) => {
  return {
    width: "30%",
    height: "10%",
    boxShadow: true,
    type: "submit",
    disabled: props.disabled && props.disabled,
  };
})`
  ${(props) =>
    props.disabled &&
    css`
      background-color: gray;
    `}
`;

const CreateRoomForm = styled.form.attrs((props) => {
  return {
    onsubmit: props.onSubmit && props.onSubmit,
  };
})`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CreateRoomModal = ({ buttonType, onClose }: Props) => {
  let titleList;
  let typeList;
  if (buttonType === ERoomCreateButtonName.ChatRoom) {
    titleList = ["방유형", "방제목", "비밀번호", "최대인원"];
    typeList = [
      EContentType.RADIO,
      EContentType.TITLE,
      EContentType.PASSWORD,
      EContentType.NUMBER,
    ];
  } else {
    titleList = ["방제목", "최대관람인원"];
    typeList = [EContentType.TITLE, EContentType.NUMBER];
  }

  const { values, errors, submitting, onChangeForm, onSubmitForm } =
    useCreateRoomForm({
      initialValues: {
        roomType: "Public",
        roomTitle: "",
        roomPassword: "",
        maxUser: "",
      },
      onSubmit: (values) => {
        console.log("----- Submit result -----");
        console.log(values);
      },
      validate: createRoomFormValidate,
    });

  return (
    <Modal width="60%" height="70%">
      <CreateRoomForm onSubmit={onSubmitForm}>
        <ModalTitle onClose={onClose} fontSize="3rem">
          {buttonType}
        </ModalTitle>
        <ModalContentWrapper>
          <ModalContent
            values={values}
            errors={errors}
            onChangeForm={onChangeForm}
            titleList={titleList}
            typeList={typeList}
          />
        </ModalContentWrapper>
        <SubmitButton disabled={submitting}>생성</SubmitButton>
      </CreateRoomForm>
    </Modal>
  );
};

export default CreateRoomModal;
