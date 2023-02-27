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

const StatConfirmModal = ({ onClose, onYesConfirm, onNoConfirm }: Props) => {
  return (
    <ConfirmModal title="최근전적" onClose={onClose} width="45%" height="35%">
      <Typography fontSize="2.8rem">
        이동 시 현재 페이지를 벗어나게 됩니다.
      </Typography>
      <Typography fontSize="2.8rem">정말 이동하시겠습니까?</Typography>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>예</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>아니오</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default StatConfirmModal;
