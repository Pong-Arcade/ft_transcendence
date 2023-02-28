import styled from "styled-components";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";

interface Props {
  onClose: () => void;
  onYesConfirm: () => void;
  onNoConfirm: () => void;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const Confirm2FAModal = ({ onClose, onYesConfirm, onNoConfirm }: Props) => {
  return (
    <ConfirmModal title="나가기" onClose={onClose}>
      <Typography fontSize="2.8rem">
        2차인증 등록 시 재로그인이 필요합니다
      </Typography>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>등록</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>닫기</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default Confirm2FAModal;
