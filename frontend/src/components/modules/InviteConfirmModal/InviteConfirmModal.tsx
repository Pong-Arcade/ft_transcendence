import styled from "styled-components";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";

interface Props {
  onClose: () => void;
  onYesConfirm?: () => void;
  onNoConfirm?: () => void;
  count: number;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const InviteConfirmModal = ({ onClose, onYesConfirm, count }: Props) => {
  return (
    <ConfirmModal title="초대하기" onClose={onClose}>
      {count === 0 ? (
        <Typography fontColor="yellow" fontSize="2.8rem">
          1명 이상 선택해주세요.
        </Typography>
      ) : (
        <Typography fontSize="2.8rem">{count} 명을 초대했습니다.</Typography>
      )}
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>닫기</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default InviteConfirmModal;
