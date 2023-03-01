import { AxiosError } from "axios";
import { MouseEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinChatRoomAPI } from "../../../api/room";
import { EChatRoomMode } from "../../../hooks/useChatRoomForm";
import useModal from "../../../hooks/useModal";
import chatRoomState from "../../../state/ChatRoomState";
import Board from "../../atoms/Board";
import ChatRoomPasswordModal from "../ChatRoomPasswordModal";
import ErrorModal from "../ErrorModal";
import LobbyChatRoomItem from "../LobbyChatRoomItem";
import LobbyChatRoomPagination from "../LobbyChatRoomPagination";
import { ILobbyChatRoom } from "../Pagination/Pagination";

const LobbyChatRoomListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "59%",
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
    justifyContent: "space-around",
    borderRadius: true,
  };
})``;

interface Props {
  list: ILobbyChatRoom[];
  page: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const LobbyChatRoomList = ({ list, page, onNextPage, onPrevPage }: Props) => {
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const setChatRoomState = useSetRecoilState(chatRoomState);
  const navigate = useNavigate();
  const {
    isModalOpen: isChatRoomPasswordModalOpen,
    onModalOpen: onChatRoomPasswordModalOpen,
    onModalClose: onChatRoomPasswordModalClose,
  } = useModal({});
  const roomIdRef = useRef<number>();

  const onJoinChatRoom = (e: MouseEvent<HTMLButtonElement>) => {
    roomIdRef.current = +e.currentTarget.id;
    if (e.currentTarget.dataset.mode === EChatRoomMode.PROTECTED)
      onChatRoomPasswordModalOpen();
    else joinChatRoom(roomIdRef.current);
  };

  const joinChatRoom = async (roomId: number) => {
    try {
      const response = await joinChatRoomAPI(roomId);
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
      <LobbyChatRoomListStyled>
        <LobbyChatRoomPagination
          list={list}
          page={page}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          PaginationItem={LobbyChatRoomItem}
          onItemClick={onJoinChatRoom}
        />
      </LobbyChatRoomListStyled>
      {isChatRoomPasswordModalOpen && (
        <ChatRoomPasswordModal
          onClose={onChatRoomPasswordModalClose}
          roomId={roomIdRef.current as number}
        />
      )}
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

export default LobbyChatRoomList;
