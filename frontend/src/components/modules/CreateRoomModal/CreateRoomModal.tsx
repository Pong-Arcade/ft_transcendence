import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import { ERoomCreateButtonName } from "../LobbyCreateRoomButtons/LobbyCreateRoomButtons";
import ModalContent from "../ModalContent";
import { EContentType } from "../ModalContent/ModalContent";
import ModalTitle from "../ModalTitle";

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

const CreateRoomModal = ({ buttonType, onClose }: Props) => {
  let titleList;
  if (buttonType === ERoomCreateButtonName.ChatRoom) {
    titleList = ["방유형", "방제목", "비밀번호", "최대인원"];
  } else {
    titleList = ["방유형", "방제목", "비밀번호", "최대관람인원"];
  }

  const typeList = [
    EContentType.RADIO,
    EContentType.TITLE,
    EContentType.PASSWORD,
    EContentType.NUMBER,
  ];
  return (
    <Modal width="60%" height="70%">
      <ModalTitle onClose={onClose} fontSize="3rem">
        {buttonType}
      </ModalTitle>
      <ModalContentWrapper>
        <ModalContent titleList={titleList} typeList={typeList} />
      </ModalContentWrapper>
      <Button width="30%" height="10%" boxShadow onClick={onClose}>
        생성
      </Button>
    </Modal>
  );
};

export default CreateRoomModal;
