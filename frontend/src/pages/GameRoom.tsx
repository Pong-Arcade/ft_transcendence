import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { leaveGameRoomAPI, leaveGameSpectatorAPI } from "../api/room";
import { checkLocationAPI } from "../api/users";
import Avatar from "../components/atoms/Avatar";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import Typography from "../components/atoms/Typography";
import ButtonGroup from "../components/modules/ButtonGroup";
import ExitConfirmModal from "../components/modules/ExitConfirmModal";
import GameBoard from "../components/modules/GameBoard";
import GameChat from "../components/modules/GameChat";
import GameCountDown from "../components/modules/GameCountDown";
import GameFinish from "../components/modules/GameFinish";
import GeneralMenu from "../components/modules/GeneralMenu";
import { EGameUserStatus } from "../components/modules/Pagination/Pagination";
import GameRoomTemplate from "../components/templates/GameRoomTemplate";
import gameRoomEvent from "../event/GameEvent/gameRoomEvent";
import gameStartEvent from "../event/GameEvent/gameStartEvent";
import useMenu from "../hooks/useMenu";
import useModal from "../hooks/useModal";
import errorState from "../state/ErrorState";
import gameRoomState from "../state/GameRoomState";
import infoState from "../state/InfoState";
import { history } from "../utils/history";

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

  const setError = useSetRecoilState(errorState);

  useEffect(() => {
    return history.listen(async (location) => {
      if (history.action === "POP") {
        const response = await checkLocationAPI(
          myInfo.userId,
          window.location.pathname
        );
        if (response) setGameState(response.data);
      }
    });
  }, [history]);
  const onLeaveGameRoom = async () => {
    try {
      if (
        myInfo.userId === redUser.userId ||
        myInfo.userId === blueUser?.userId
      )
        await leaveGameRoomAPI(roomId);
      else await leaveGameSpectatorAPI(roomId);
      setGameState({
        roomId: -1,
        redUser: {},
        blueUser: {},
      });
      navigate("/lobby");
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  gameRoomEvent();
  const {
    onReady,
    isReady,
    isOnGame,
    timeLimit,
    scoreRef,
    isGameFinish,
    setGameFinish,
  } = gameStartEvent(roomId);

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);
  useEffect(() => {
    if (roomId === -1)
      setError({
        isError: true,
        error: { message: "해당 방이 없습니다" },
        isChangePage: true,
      });
    else setError({ isError: false, error: "" });
  }, [roomId, redUser, blueUser]);

  return (
    <>
      <GameRoomTemplate>
        <GameBoard
          roomId={roomId}
          userId={myInfo.userId}
          isOnGame={isOnGame}
          scoreRef={scoreRef}
        />
        <Wrapper>
          <UserProfileGroup>
            <UserProfile
              id={redUser.userId?.toString()}
              onClick={onOpenMenu}
              isReady={redUser.gameUserStatus === EGameUserStatus.READY}
            >
              <Avatar width="8rem" height="8rem" src={redUser.avatarUrl} />
              <Typography fontSize="2rem">{redUser.nickname}</Typography>
              <Typography fontSize="1.2rem" fontColor="red">
                (RED)
              </Typography>
            </UserProfile>
            <UserProfile
              id={blueUser?.userId?.toString()}
              onClick={onOpenMenu}
              disabled={!blueUser?.userId}
              isReady={blueUser?.gameUserStatus === EGameUserStatus.READY}
            >
              <Avatar width="8rem" height="8rem" src={blueUser?.avatarUrl} />
              <Typography fontSize="2rem">{blueUser?.nickname}</Typography>
              <Typography fontSize="1.2rem" fontColor="blue">
                (BLUE)
              </Typography>
            </UserProfile>
          </UserProfileGroup>
          <GameChat width="98%" height="54%" />
          <ButtonGroup
            width="100%"
            height="10%"
            flexDirection="column"
            backgroundColor="secondary"
            gap="0.3vh"
          >
            {(myInfo.userId === redUser.userId ||
              myInfo.userId === blueUser?.userId) && (
              <GameRoomButton onClick={onReady} disabled={isOnGame}>
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
      {isOnGame && <GameCountDown timeLimit={timeLimit} />}
      {isGameFinish && (
        <GameFinish
          scoreRef={scoreRef}
          redUser={redUser}
          blueUser={blueUser}
          onClose={() => setGameFinish(false)}
        />
      )}
    </>
  );
};

export default GameRoom;
