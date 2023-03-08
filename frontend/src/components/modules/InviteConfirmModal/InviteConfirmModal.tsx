import { useParams } from "react-router-dom";
import styled from "styled-components";
import { inviteChatRoomAPI } from "../../../api/room";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";

interface Props {
  onClose: () => void;
  onYesConfirm?: () => void;
  onNoConfirm?: () => void;
  list: string[];
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const InviteConfirmModal = ({ onClose, onYesConfirm, list }: Props) => {
  const params = useParams();

  if (list.length !== 0) {
    inviteChatRoomAPI(Number(params.chatId), list);
  }
  return (
    <ConfirmModal title="초대하기" onClose={onClose}>
      {list.length === 0 ? (
        <Typography fontColor="yellow" fontSize="2.8rem">
          1명 이상 선택해주세요.
        </Typography>
      ) : (
        <Typography fontSize="2.8rem">
          {list.length} 명을 초대했습니다.
        </Typography>
      )}
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>닫기</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default InviteConfirmModal;
