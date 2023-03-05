import { MouseEvent } from "react";
import styled from "styled-components";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ModalTitle from "../ModalTitle";

export enum EGameRoomJoin {
  PLAYER = "플레이어",
  SPECTATOR = "관전자",
}

interface Props {
  onJoinGameRoom: (e: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

const ChooseJoinButton = styled(Button).attrs({
  width: "49.5%",
  height: "100%",
  fontSize: "2rem",
})``;

const GameRoomJoinModal = ({ onClose, onJoinGameRoom }: Props) => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle
          onClose={onClose}
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
        >
          게임방참가
        </ModalTitle>
        <ButtonGroup
          height="79%"
          width="100%"
          backgroundColor="secondary"
          justifyContent="space-between"
        >
          <ChooseJoinButton onClick={onJoinGameRoom}>
            {EGameRoomJoin.PLAYER}
          </ChooseJoinButton>
          <ChooseJoinButton onClick={onJoinGameRoom}>
            {EGameRoomJoin.SPECTATOR}
          </ChooseJoinButton>
        </ButtonGroup>
      </Modal>
    </ModalWrapper>
  );
};

export default GameRoomJoinModal;
