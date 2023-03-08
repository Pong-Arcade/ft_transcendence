import { ReactNode } from "react";
import styled from "styled-components";
import { ILobbyChatRoomErrors } from "../../../hooks/useChatRoomForm";
import { IGameRoomErrors } from "../../../hooks/useGameRoomForm";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";

type ErrorType = ILobbyChatRoomErrors | IGameRoomErrors;
interface Props {
  onClose: () => void;
  title: string;
  errors: ErrorType | string;
}
const Wrapper = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    width: "100%",
    height: "51%",
    borderRadius: true,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})``;

const ErrorMessage = styled(Typography).attrs({
  fontSize: "2rem",
})`
  color: yellow;
`;

const ModalButton = styled(Button).attrs({
  width: "50%",
  height: "20%",
})``;

const ErrorModal = ({ onClose, errors, title }: Props) => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle onClose={onClose} height="25%" fontSize="2rem">
          {title}
        </ModalTitle>
        <Wrapper>
          {typeof errors === "string" ? (
            <ErrorMessage>{errors}</ErrorMessage>
          ) : (
            Object.values(errors).map((value, index) => (
              <ErrorMessage key={index}>{value as ReactNode}</ErrorMessage>
            ))
          )}
        </Wrapper>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default ErrorModal;
