import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { enroll2FAAPI } from "../../../api/auth";
import { getUserInfoAPI } from "../../../api/users";
import useFriendUsers from "../../../hooks/useFriendUsers";
import useModal from "../../../hooks/useModal";
import errorState from "../../../state/ErrorState";
import friendUsersState from "../../../state/FriendUsersState";
import GameSocket from "../../../state/GameSocket";
import infoState from "../../../state/InfoState";
import { SocketContext } from "../../../utils/ChatSocket";
import { removeJWT } from "../../../utils/token";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import Confirm2FAModal from "../Confirm2FAModal";
import ModalTitle from "../ModalTitle";
import { EUserStatus, IUser } from "../Pagination/Pagination";
import StatModal from "../StatModal";
import UserInfoSettingModal from "../UserInfoSettingModal";

interface Props {
  onClose: () => void;
  userId: number;
}

const UserInfoModalButton = styled(Button).attrs({
  width: "30%",
  height: "95%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const GridWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 79%;
  grid-template: repeat(7, 1fr) / repeat(8, 1fr);
  gap: 0.1vw;
`;

const MyAvatar = styled(Avatar).attrs({
  width: "16vw",
  height: "16vw",
})`
  grid-row: 1 / span 3;
  grid-column: 1 / span 3;
  margin: auto;
`;

const InfoTitle = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.background.front,
    borderRadius: true,
  };
})`
  font-size: 2rem;
  grid-column: 1 / span 1;
`;

const InfoContent = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})`
  font-size: 2rem;
  grid-column: 2 / span 4;
`;

const InfoWrapper = styled(Board)<{ row: number }>`
  grid-column: 4 / -1;
  display: grid;
  gap: 0.1vw;
  grid-template: 1fr / repeat(4, 1fr);
`;

const GameStatTitle = styled(Board).attrs({
  borderRadius: true,
  height: "90%",
})`
  grid-row: 4 / span 1;
  grid-column: 1 / -1;
  display: grid;
  grid-template: 1fr / repeat(4, 1fr);
  text-align: center;
  align-items: center;
  align-self: end;
  background-color: ${(props) => props.theme.background.front};
`;

const GameStatContent = styled(Board).attrs({
  borderRadius: true,
})`
  grid-row: 5 / span 2;
  grid-column: 1 / -1;
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(4, 1fr);
  text-align: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.middle};
`;

const CurrentLocationTitle = styled(Board).attrs({
  borderRadius: true,
})`
  grid-row: 7 / span 1;
  grid-column: 1 / span 2;
  font-size: 2rem;
  background-color: ${(props) => props.theme.background.front};
`;
const CurrentLocationContent = styled(Board).attrs({
  borderRadius: true,
})`
  grid-row: 7 / span 1;
  grid-column: 3 / -1;
  font-size: 2rem;
  background-color: ${(props) => props.theme.background.middle};
`;

const UserInfoModal = ({ onClose, userId }: Props) => {
  const myInfo = useRecoilValue(infoState);
  const [userInfo, setUserInfo] = useState<IUser>({});
  const setError = useSetRecoilState(errorState);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserInfoAPI(userId);
        const date = new Date(data.firstLogin);
        setUserInfo({ ...data, firstLogin: date.toISOString().split("T")[0] });
      } catch (error) {
        setError({ isError: true, error });
      }
    })();
  }, []);

  const infoTitleList = ["이름", "가입일", "이메일"];
  const infoContentList = [
    userInfo.nickname,
    userInfo.firstLogin,
    userInfo.email,
  ];
  const gameStatTitleList = ["게임종류", "승리", "패배", "승률"];
  const gameStatContentList = [
    "레더게임",
    userInfo.ladderInfo?.winCount,
    userInfo.ladderInfo?.loseCount,
    `${userInfo.ladderInfo?.winRate}%`,
    "일반게임",
    userInfo.normalInfo?.winCount,
    userInfo.normalInfo?.loseCount,
    `${userInfo.normalInfo?.winRate}%`,
  ];
  const { isModalOpen: isInfoSettingOpen, onModalOpen: onInfoSettingOpen } =
    useModal({});
  const {
    isModalOpen: isStatModalOpen,
    onModalOpen: onStatModalOpen,
    onModalClose: onStatModalClose,
  } = useModal({});
  const {
    isModalOpen: isConfirmModalOpen,
    onModalOpen: onConfirmModalOpen,
    onModalClose: onConfirmModalClose,
  } = useModal({});

  const { onAddFriend, onDelFriend } = useFriendUsers(userId);
  const friendUsers = useRecoilValue(friendUsersState);
  const isFriend = friendUsers.find((user) => user.userId === userId);
  const navigate = useNavigate();

  const socket = useContext(SocketContext);
  const gameSocket = useContext(GameSocket);

  const onEnroll2FA = async () => {
    try {
      await enroll2FAAPI();

      socket.socket.close();
      gameSocket.socket.close();
      removeJWT();
      navigate("/");
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  return (
    <ModalWrapper>
      <Modal width={"60%"} height={"95%"} animation>
        <ModalTitle onClose={onClose} fontSize="3rem" height="10%">
          {userInfo.nickname}
        </ModalTitle>
        <GridWrapper>
          <MyAvatar src={userInfo.avatarUrl} />
          {infoTitleList.map((title, index) => (
            <InfoWrapper key={index} row={index}>
              <InfoTitle>{title}</InfoTitle>
              <InfoContent>{infoContentList[index]}</InfoContent>
            </InfoWrapper>
          ))}
          <GameStatTitle key={"GameStatTitle"}>
            {gameStatTitleList.map((title, index) => (
              <Typography key={index} fontSize="2rem">
                {title}
              </Typography>
            ))}
          </GameStatTitle>
          <GameStatContent key={"GameStatContent"}>
            {gameStatContentList.map((content, index) => (
              <Typography key={index} fontSize="2rem">
                {content}
              </Typography>
            ))}
          </GameStatContent>
          <CurrentLocationTitle>현재 상태</CurrentLocationTitle>
          <CurrentLocationContent>
            {userInfo.status === EUserStatus.OFFLINE && "오프라인 상태입니다"}
            {userInfo.status === EUserStatus.LOBBY && "로비에 있습니다"}
            {userInfo.status === EUserStatus.GAME && "게임방에 있습니다"}
            {userInfo.status === EUserStatus.CHAT && "채팅방에 있습니다"}
          </CurrentLocationContent>
        </GridWrapper>
        <ButtonGroup width="100%" height="8%" backgroundColor="secondary">
          {userInfo.userId === myInfo.userId ? (
            <>
              <UserInfoModalButton onClick={onConfirmModalOpen}>
                2차인증 등록
              </UserInfoModalButton>
              <UserInfoModalButton onClick={onInfoSettingOpen}>
                프로필설정
              </UserInfoModalButton>
            </>
          ) : isFriend ? (
            <UserInfoModalButton onClick={async () => await onDelFriend()}>
              친구삭제
            </UserInfoModalButton>
          ) : (
            <UserInfoModalButton onClick={async () => await onAddFriend()}>
              친구추가
            </UserInfoModalButton>
          )}
          <UserInfoModalButton onClick={onStatModalOpen}>
            최근전적
          </UserInfoModalButton>
        </ButtonGroup>
      </Modal>
      {isInfoSettingOpen && (
        <UserInfoSettingModal onClose={onClose} info={userInfo} />
      )}
      {isConfirmModalOpen && (
        <Confirm2FAModal
          onClose={onConfirmModalClose}
          onYesConfirm={onEnroll2FA}
          onNoConfirm={onConfirmModalClose}
        />
      )}
      {isStatModalOpen && (
        <StatModal
          onClose={onStatModalClose}
          userId={userId}
          nickname={userInfo.nickname as string}
        />
      )}
    </ModalWrapper>
  );
};

export default UserInfoModal;
