import styled from "styled-components";
import { IErrors } from "../../../hooks/useChatRoomForm";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";

interface Props {
  onClose: () => void;
  errors: IErrors;
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

const ErrorModal = ({ onClose, errors }: Props) => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle onClose={onClose} height="25%" fontSize="2rem">
          방만들기 실패
        </ModalTitle>
        <Wrapper>
          {errors.Type && <ErrorMessage>{errors.Type}</ErrorMessage>}
          {errors.Title && <ErrorMessage>{errors.Title}</ErrorMessage>}
          {errors.Password && <ErrorMessage>{errors.Password}</ErrorMessage>}
          {errors.MaxUser && <ErrorMessage>{errors.MaxUser}</ErrorMessage>}
        </Wrapper>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default ErrorModal;
