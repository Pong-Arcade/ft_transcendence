import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinChatRoomAPI } from "../../../api/room";
import chatRoomState from "../../../state/ChatRoomState";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";
import ErrorModal from "../ErrorModal";

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
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const setChatRoomState = useSetRecoilState(chatRoomState);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onPasswordSubmit = async () => {
    try {
      console.log(inputRef.current?.value);
      const response = await joinChatRoomAPI(roomId, inputRef.current?.value);
      setChatRoomState(response.data);

      navigate(`/chat-rooms/${roomId}`, {
        state: { users: response.data.users },
      });
    } catch (e: any | AxiosError) {
      if (e instanceof AxiosError) {
        setError(true);
        setErrorContent(e.response?.data.message);
      }
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
      {error && (
        <ErrorModal
          onClose={() => setError(false)}
          errors={errorContent}
          title="방입장 실패"
        />
      )}
    </>
  );
};

export default ChatRoomPasswordModal;
