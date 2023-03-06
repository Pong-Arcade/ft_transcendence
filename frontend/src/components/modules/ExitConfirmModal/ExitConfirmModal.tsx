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

const ExitConfirmModal = ({ onClose, onYesConfirm, onNoConfirm }: Props) => {
  return (
    <ConfirmModal title="나가기" onClose={onClose}>
      <Typography fontSize="2.5rem">정말 방을 나가시겠습니까?</Typography>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>예</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>아니오</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default ExitConfirmModal;
