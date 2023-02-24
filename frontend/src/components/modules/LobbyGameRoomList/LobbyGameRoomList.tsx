import { AxiosError, AxiosResponse } from "axios";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinGameRoomAPI } from "../../../api/room";
import gameRoomState from "../../../state/GameRoomState";
import Board from "../../atoms/Board";
import ErrorModal from "../ErrorModal";
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
  const navigate = useNavigate();
  const [errorContent, setErrorContent] = useState("");
  const setGameState = useSetRecoilState(gameRoomState);

  const joinGameRoom = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      const { data }: AxiosResponse<ILobbyGameRoom, any> =
        await joinGameRoomAPI(event.currentTarget.id);
      setGameState({
        roomId: data.roomId,
        users: [data.redUser, data.blueUser],
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
    <LobbyGameRoomListStyled>
      <LobbyGameRoomPagination
        list={list}
        page={page}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        PaginationItem={LobbyGameRoomItem}
        onItemClick={joinGameRoom}
      />
      {error && (
        <ErrorModal
          onClose={() => setError(false)}
          errors={errorContent}
          title="방입장 실패"
        />
      )}
    </LobbyGameRoomListStyled>
  );
};

export default LobbyGameRoomList;
