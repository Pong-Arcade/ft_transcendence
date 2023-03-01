import styled from "styled-components";
import Board from "../../atoms/Board";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Spinner from "../../atoms/Spinner";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";

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

const InviateGameWaitingModal = () => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
          exceptCloseButton
        >
          게임신청
        </ModalTitle>
        <Wrapper>
          <Typography fontSize="3rem">응답 대기 중입니다</Typography>
          <Spinner />
        </Wrapper>
      </Modal>
    </ModalWrapper>
  );
};

export default InviateGameWaitingModal;
