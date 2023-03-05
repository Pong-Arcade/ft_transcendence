import { AxiosResponse } from "axios";
import { MouseEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinGamePlayerAPI, joinGameSpectatorAPI } from "../../../api/room";
import useModal from "../../../hooks/useModal";
import errorState from "../../../state/ErrorState";
import gameRoomState from "../../../state/GameRoomState";
import Board from "../../atoms/Board";
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
  const setError = useSetRecoilState(errorState);
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
    } catch (error) {
      setError({ isError: true, error });
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
