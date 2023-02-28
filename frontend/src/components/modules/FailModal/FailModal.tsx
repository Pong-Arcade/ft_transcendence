import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";

interface Props {
  onClose: () => void;
}

const ModalButton = styled(Button).attrs({
  width: "50%",
  height: "20%",
})``;

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

const FailModal = ({ onClose }: Props) => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle onClose={onClose} height="25%" fontSize="2rem">
          인증 실패
        </ModalTitle>
        <Wrapper>
          <Typography fontSize="2rem">인증에 실패했습니다</Typography>
        </Wrapper>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default FailModal;
