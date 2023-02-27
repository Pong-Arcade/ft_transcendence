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

const ChatInviteModal = ({ onClose, onYesConfirm, onNoConfirm }: Props) => {
  return (
    <ConfirmModal title="채팅초대" onClose={onClose}>
      <Typography fontSize="2.8rem">
        누구누구가 채팅방에 초대했습니다
      </Typography>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>승락</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>거절</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default ChatInviteModal;
