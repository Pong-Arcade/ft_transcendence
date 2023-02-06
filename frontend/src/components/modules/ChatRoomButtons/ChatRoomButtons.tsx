import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useConfirm from "../../../hooks/useConfirm";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";
import { EConfirmType } from "../ConfirmModal/ConfirmModal";
import InviteModal from "../InviteModal";

const ChatRoomButton = styled(Button).attrs({
  fontSize: "2rem",
  height: "7vh",
  width: "30vw",
})``;

const ChatRoomButtons = () => {
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const onOpenInvite = () => {
    setIsOpenInvite(true);
  };
  const onCloseInvite = () => {
    setIsOpenInvite(false);
  };

  const { isOpenConfirm, onOpenConfirm, onCloseConfirm } = useConfirm();
  const navigate = useNavigate();
  const onYesConfirm = () => {
    navigate("/lobby");
  };
  const onNoConfirm = () => {
    onCloseConfirm();
  };

  return (
    <>
      <ButtonGroup height="7%" width="100%" backgroundColor="secondary">
        <ChatRoomButton onClick={onOpenInvite}>초대하기</ChatRoomButton>
        <ChatRoomButton onClick={onOpenConfirm}>나가기</ChatRoomButton>
      </ButtonGroup>

      {isOpenInvite && (
        <ModalWrapper onClose={onCloseInvite}>
          <InviteModal onClose={onCloseInvite} />
        </ModalWrapper>
      )}
      {isOpenConfirm && (
        <ModalWrapper onClose={onCloseConfirm}>
          <ConfirmModal
            onClose={onCloseConfirm}
            type={EConfirmType.EXIT}
            onYesConfirm={onYesConfirm}
            onNoConfirm={onNoConfirm}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default ChatRoomButtons;
