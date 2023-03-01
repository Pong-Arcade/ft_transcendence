import styled from "styled-components";
import Board from "../../atoms/Board";
import Modal from "../../atoms/Modal";
import Spinner from "../../atoms/Spinner";
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

const InviteRejectModal = ({ onClose }: Props) => {
  return (
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
        <Typography fontSize="3rem">게임 신청을 거절 당하셨습니다</Typography>
        <Spinner />
      </Wrapper>
    </Modal>
  );
};

export default InviteRejectModal;
