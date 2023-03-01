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

const Wrapper = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "79%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    flexDirection: "column",
  };
})`
  gap: 6vh;
`;

const ModalButton = styled(Button).attrs({
  width: "50%",
  height: "20%",
})``;

const InviteRejectModal = ({ onClose }: Props) => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
          onClose={onClose}
        >
          게임 신청 거절
        </ModalTitle>
        <Wrapper>
          <Typography fontSize="3rem">거절 당하셨습니다</Typography>
        </Wrapper>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default InviteRejectModal;
