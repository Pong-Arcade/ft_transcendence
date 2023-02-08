import { useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ModifyChatRoomModal from "../ModifyChatRoomModal";

const ChatRoomPasswordModifyStyled = styled(Board).attrs((props) => {
  return {
    width: "22%",
    height: "9%",
    backgroundColor: props.theme.background.front,
    borderRadius: true,
  };
})`
  position: absolute;
  top: 0.5%;
  right: 12%;
  gap: 1rem;
`;

const ModifyButton = styled(Button).attrs({
  width: "90%",
  height: "80%",
  boxShadow: true,
  fontSize: "2rem",
})``;

// TODO: 리팩토링 모달 open hook 정리
const ChatRoomPasswordModify = () => {
  const TITLE = "비밀번호수정";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onModalOpen = () => {
    setIsModalOpen(true);
  };
  const onModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <ChatRoomPasswordModifyStyled>
        <ModifyButton onClick={onModalOpen}>{TITLE}</ModifyButton>
      </ChatRoomPasswordModifyStyled>
      {isModalOpen && (
        <ModalWrapper>
          <ModifyChatRoomModal onClose={onModalClose} title={TITLE} />
        </ModalWrapper>
      )}
    </>
  );
};

export default ChatRoomPasswordModify;
