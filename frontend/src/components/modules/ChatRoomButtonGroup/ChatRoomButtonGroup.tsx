import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { leaveChatRoomAPI } from "../../../api/room";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";
import ExitConfirmModal from "../ExitConfirmModal";
import InviteModal from "../InviteModal";

const ChatRoomButton = styled(Button).attrs({
  fontSize: "2rem",
  height: "7vh",
  width: "30vw",
})``;

const ChatRoomButtonGroup = () => {
  const {
    isModalOpen: isConfirmOpen,
    onModalOpen: onConfirmOpen,
    onModalClose: onConfirmClose,
  } = useModal({});
  const {
    isModalOpen: isInviteOpen,
    onModalOpen: onInviteOpen,
    onModalClose: onInviteClose,
  } = useModal({});
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  return (
    <>
      <ButtonGroup height="7%" width="100%" backgroundColor="secondary">
        <ChatRoomButton onClick={onInviteOpen}>초대하기</ChatRoomButton>
        <ChatRoomButton onClick={onConfirmOpen}>나가기</ChatRoomButton>
      </ButtonGroup>
      {isInviteOpen && <InviteModal onClose={onInviteClose} />}
      {isConfirmOpen && (
        <ExitConfirmModal
          onClose={onConfirmClose}
          onYesConfirm={async () => {
            try {
              await leaveChatRoomAPI(Number(params.chatId));
              navigate("/lobby");
            } catch (e: any | AxiosError) {
              if (e instanceof AxiosError) {
                setError(true);
                setErrorContent(e.response?.data.message);
              }
            }
          }}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
    </>
  );
};

export default ChatRoomButtonGroup;
