import styled from "styled-components";
import Button from "../../atoms/Button";
import { ILobbyGameRoom, IPaginationItem } from "../Pagination/Pagination";
import Board from "../../atoms/Board";
import Typography from "../../atoms/Typography";
import Avatar from "../../atoms/Avatar";

const LobbyGameRoomItemStyled = styled(Button).attrs((props) => {
  return {
    backgroundColor: props.theme.background.front,
  };
})`
  display: grid;
  grid-template: 1fr 4fr 1fr / 1fr;
`;

const GameRoomTitle = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.colors.spiroDiscoBall,
    borderRadius: true,
  };
})`
  text-align: center;
  font-size: 2rem;
`;

const GameRoomUsers = styled(Board)`
  display: grid;
  grid-template: 1fr / 3fr 1fr 3fr;
`;

const GameRoomStatus = styled(Board).attrs({
  justifyContent: "space-around",
})``;

const GameUser = styled(Board).attrs({
  flexDirection: "column",
  justifyContent: "space-around",
})``;
const GameUserAvatar = styled(Avatar).attrs({
  width: "11vw",
  height: "11vw",
})`
  background-color: ${(props) => props.theme.background.middle};
  justify-self: center;
`;

const GameUserNickname = styled(Board).attrs({
  borderRadius: true,
})`
  height: 15%;
  background-color: ${(props) => props.theme.background.middle};
`;

const LobbyGameRoomItem = ({ item, onItemClick }: IPaginationItem) => {
  const {
    roomId,
    redUser,
    blueUser,
    maxSpectatorCount,
    curSpectatorCount,
    // roomStatus, // 게임 중이면 주황색
    title,
    mode,
  } = item as ILobbyGameRoom;

  return (
    <LobbyGameRoomItemStyled id={roomId.toString()} onClick={onItemClick}>
      <GameRoomTitle>{title}</GameRoomTitle>
      <GameRoomUsers>
        <GameUser>
          <GameUserAvatar src={redUser.avatarUrl} />
          <GameUserNickname>{redUser.nickname}</GameUserNickname>
        </GameUser>

        <Typography fontSize="3rem">vs</Typography>
        <GameUser>
          <GameUserAvatar src={blueUser?.avatarUrl} />
          <GameUserNickname>{blueUser?.nickname}</GameUserNickname>
        </GameUser>
      </GameRoomUsers>
      <GameRoomStatus>
        <Typography fontSize="1.5rem">모드 : {mode}</Typography>
        <Typography fontSize="1.5rem">
          관람인원 : {curSpectatorCount || 0} / {maxSpectatorCount}
        </Typography>
      </GameRoomStatus>
    </LobbyGameRoomItemStyled>
  );
};

export default LobbyGameRoomItem;
