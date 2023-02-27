import { AxiosError, AxiosResponse } from "axios";
import { MouseEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinGamePlayerAPI, joinGameSpectatorAPI } from "../../../api/room";
import useModal from "../../../hooks/useModal";
import gameRoomState from "../../../state/GameRoomState";
import Board from "../../atoms/Board";
import ErrorModal from "../ErrorModal";
import GameRoomJoinModal from "../GameRoomJoinModal";
import { EGameRoomJoin } from "../GameRoomJoinModal/GameRoomJoinModal";
import LobbyGameRoomItem from "../LobbyGameRoomItem";
import LobbyGameRoomPagination from "../LobbyGameRoomPagination";
import { ILobbyGameRoom } from "../Pagination/Pagination";

const LobbyGameRoomListStyled = styled(Board).attrs((props) => {
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
  list: ILobbyGameRoom[];
  page: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const LobbyGameRoomList = ({ list, page, onNextPage, onPrevPage }: Props) => {
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const navigate = useNavigate();
  const setGameState = useSetRecoilState(gameRoomState);
  const roomId = useRef("");
  const {
    isModalOpen: isGameJoinModalOpen,
    onModalOpen: onGameJoinModalOpen,
    onModalClose: onGameJoinModalClose,
  } = useModal({
    beforeOpen: (e) => {
      if (e) roomId.current = e.currentTarget.id.toString();
    },
  });

  const onJoinGameRoom = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const { data }: AxiosResponse<ILobbyGameRoom, any> =
        e.currentTarget.innerText === EGameRoomJoin.PLAYER
          ? await joinGamePlayerAPI(+roomId.current)
          : await joinGameSpectatorAPI(+roomId.current);

      setGameState({
        roomId: data.roomId,
        redUser: data.redUser,
        blueUser: data.blueUser,
      });
      navigate(`/game-rooms/${data.roomId}`);
    } catch (e: any | AxiosError) {
      if (e instanceof AxiosError) {
        setError(true);
        setErrorContent(e.response?.data.message);
      }
    }
  };

  return (
    <>
      <LobbyGameRoomListStyled>
        <LobbyGameRoomPagination
          list={list}
          page={page}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          PaginationItem={LobbyGameRoomItem}
          onItemClick={onGameJoinModalOpen}
        />
        {error && (
          <ErrorModal
            onClose={() => setError(false)}
            errors={errorContent}
            title="방입장 실패"
          />
        )}
      </LobbyGameRoomListStyled>
      {isGameJoinModalOpen && (
        <GameRoomJoinModal
          onClose={onGameJoinModalClose}
          onJoinGameRoom={onJoinGameRoom}
        />
      )}
    </>
  );
};

export default LobbyGameRoomList;
