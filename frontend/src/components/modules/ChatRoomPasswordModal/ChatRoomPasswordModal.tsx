import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinChatRoomAPI } from "../../../api/room";
import chatRoomState from "../../../state/ChatRoomState";
import errorState from "../../../state/ErrorState";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";

interface Props {
  onClose: () => void;
  roomId: number;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const PasswordInput = styled(Input).attrs({
  borderRadius: true,
  type: "password",
})`
  width: 80%;
  height: 40%;
`;

const ChatRoomPasswordModal = ({ onClose, roomId }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setError = useSetRecoilState(errorState);
  const setChatRoomState = useSetRecoilState(chatRoomState);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onPasswordSubmit = async () => {
    try {
      const response = await joinChatRoomAPI(roomId, inputRef.current?.value);
      response.data.roomId = roomId;
      setChatRoomState(response.data);

      navigate(`/chat-rooms/${roomId}`);
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  return (
    <>
      <ConfirmModal title="비밀번호 입력" onClose={onClose}>
        <PasswordInput ref={inputRef} />
        <ButtonGroup width="100%" height="30%">
          <ConfirmButton onClick={onPasswordSubmit}>입장</ConfirmButton>
        </ButtonGroup>
      </ConfirmModal>
    </>
  );
};

export default ChatRoomPasswordModal;
