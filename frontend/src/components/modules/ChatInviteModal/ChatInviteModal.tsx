import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  acceptInviteChatRoomAPI,
  rejectInviteChatRoomAPI,
} from "../../../api/room";
import chatRoomState from "../../../state/ChatRoomState";
import errorState from "../../../state/ErrorState";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";

interface Props {
  userName: string;
  roomId: number;
  onClose: () => void;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const ChatInviteModal = ({ userName, roomId, onClose }: Props) => {
  const navigate = useNavigate();
  const setChatRoomState = useSetRecoilState(chatRoomState);
  const setError = useSetRecoilState(errorState);
  const onYesConfirm = async () => {
    try {
      const response = await acceptInviteChatRoomAPI(roomId);
      response.data.roomId = roomId;
      setChatRoomState(response.data);
      navigate("/chat-rooms/" + roomId);
    } catch (error) {
      onClose();
      setError({ isError: true, error });
    }
  };
  const onNoConfirm = () => {
    rejectInviteChatRoomAPI(roomId);
    onClose();
  };

  return (
    <ConfirmModal title="채팅초대" onClose={onClose}>
      <Typography fontSize="2.8rem">
        {userName}가 채팅방에 초대했습니다
      </Typography>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>승락</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>거절</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default ChatInviteModal;
