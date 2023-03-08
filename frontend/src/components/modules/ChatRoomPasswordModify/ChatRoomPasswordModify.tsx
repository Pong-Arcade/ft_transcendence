import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
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
  right: 0.5%;
  gap: 1rem;
`;

const ModifyButton = styled(Button).attrs({
  width: "90%",
  height: "80%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const ChatRoomPasswordModify = () => {
  const TITLE = "비밀번호수정";
  const { isModalOpen, onModalOpen, onModalClose } = useModal({});

  return (
    <>
      <ChatRoomPasswordModifyStyled>
        <ModifyButton onClick={onModalOpen}>{TITLE}</ModifyButton>
      </ChatRoomPasswordModifyStyled>
      {isModalOpen && (
        <ModifyChatRoomModal onClose={onModalClose} title={TITLE} />
      )}
    </>
  );
};

export default ChatRoomPasswordModify;
