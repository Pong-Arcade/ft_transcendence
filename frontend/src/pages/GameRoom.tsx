import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  leaveGameRoomAPI,
  readyGameRoomAPI,
  unReadyGameRoomAPI,
} from "../api/room";
import Avatar from "../components/atoms/Avatar";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import Typography from "../components/atoms/Typography";
import ButtonGroup from "../components/modules/ButtonGroup";
import Chat from "../components/modules/Chat";
import ExitConfirmModal from "../components/modules/ExitConfirmModal";
import GameBoard from "../components/modules/GameBoard";
import GameCountDown from "../components/modules/GameCountDown";
import GeneralMenu from "../components/modules/GeneralMenu";
import { EGameUserStatus } from "../components/modules/Pagination/Pagination";
import GameRoomTemplate from "../components/templates/GameRoomTemplate";
import gameRoomEvent from "../event/GameEvent/gameRoomEvent";
import gameStartEvent from "../event/GameEvent/gameStartEvent";
import useMenu from "../hooks/useMenu";
import useModal from "../hooks/useModal";
import gameRoomState from "../state/GameRoomState";
import infoState from "../state/InfoState";

const Wrapper = styled(Board).attrs({
  width: "24%",
  height: "98%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const GameRoomButton = styled(Button).attrs({
  width: "22vw",
  height: "90%",
  boxShadow: true,
})``;

const UserProfileGroup = styled(Board).attrs({
  width: "98%",
  height: "35%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const UserProfile = styled(Button).attrs({
  width: "98%",
  height: "49%",
  boxShadow: true,
})<{ isReady?: boolean }>`
  background-color: ${(props) =>
    props.isReady ? "orange" : props.theme.background.middle};
  display: grid;
  grid-template: 1fr / repeat(3, 1fr);
  align-items: center;
`;

const GameRoom = () => {
  const {
    isOpenMenu,
    onOpenMenu,
    onCloseMenu,
    positionX,
    positionY,
    id,
    name,
  } = useMenu();

  const {
    isModalOpen: isConfirmOpen,
    onModalOpen: onConfirmOpen,
    onModalClose: onConfirmClose,
  } = useModal({});

  const navigate = useNavigate();
  const [{ roomId, redUser, blueUser }, setGameState] =
    useRecoilState(gameRoomState);
  const myInfo = useRecoilValue(infoState);

  const onLeaveGameRoom = async () => {
    await leaveGameRoomAPI(roomId);
    setGameState({
      roomId: -1,
      redUser: {},
      blueUser: {},
    });
    navigate("/lobby");
  };

  gameRoomEvent();
  const { isCountDown, timeLimit } = gameStartEvent();
  const [isReady, setReady] = useState(false);

  const onReady = async () => {
    if (!isReady) await readyGameRoomAPI(roomId);
    else await unReadyGameRoomAPI(roomId);
    setReady((prev) => !prev);
  };

  return (
    <>
      <GameRoomTemplate>
        <GameBoard roomId={roomId} userId={myInfo.userId} />
        <Wrapper>
          <UserProfileGroup>
            <UserProfile
              id={redUser.userId?.toString()}
              onClick={onOpenMenu}
              isReady={redUser.gameUserStatus === EGameUserStatus.READY}
            >
              <Avatar width="8rem" height="8rem" src={redUser.avatarUrl} />
              <Typography fontSize="2rem">{redUser.nickname}</Typography>
              <Typography fontSize="1.2rem">(RED)</Typography>
            </UserProfile>
            <UserProfile
              id={blueUser?.userId?.toString()}
              onClick={onOpenMenu}
              disabled={!blueUser?.userId}
              isReady={blueUser?.gameUserStatus === EGameUserStatus.READY}
            >
              <Avatar width="8rem" height="8rem" src={blueUser?.avatarUrl} />
              <Typography fontSize="2rem">{blueUser?.nickname}</Typography>
              <Typography fontSize="1.2rem">(BLUE)</Typography>
            </UserProfile>
          </UserProfileGroup>
          <Chat width="98%" height="54%" />
          <ButtonGroup
            width="100%"
            height="10%"
            flexDirection="column"
            backgroundColor="secondary"
            gap="0.3vh"
          >
            {(myInfo.userId === redUser.userId ||
              myInfo.userId === blueUser?.userId) && (
              <GameRoomButton onClick={onReady} disabled={isCountDown}>
                {isReady ? "대기" : "준비"}
              </GameRoomButton>
            )}
            <GameRoomButton onClick={onConfirmOpen}>나가기</GameRoomButton>
          </ButtonGroup>
        </Wrapper>
      </GameRoomTemplate>
      <GeneralMenu
        userId={id}
        name={name}
        isOpenMenu={isOpenMenu}
        onClose={onCloseMenu}
        top={positionY}
        left={positionX}
      />
      {isConfirmOpen && (
        <ExitConfirmModal
          onClose={onConfirmClose}
          onYesConfirm={onLeaveGameRoom}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
      {isCountDown && <GameCountDown timeLimit={timeLimit} />}
    </>
  );
};

export default GameRoom;
