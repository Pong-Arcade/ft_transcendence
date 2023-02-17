import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { createFriendUsersAPI } from "../../../api/users";
import useModal from "../../../hooks/useModal";
import myInfoState from "../../../state/MyInfoState";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ModalTitle from "../ModalTitle";
import UserInfoSettingModal from "../UserInfoSettingModal";

interface Props {
  onClose: () => void;
  width: string;
  height: string;
  userId: string;
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

const UserInfoModal = ({ onClose, width, height, userId }: Props) => {
  const myInfo = useRecoilValue(myInfoState);
  const infoTitleList = ["이름", "가입일", "이메일"];
  const infoContentList = [myInfo.nickname, "2021-08-01", "kangkim@naver.com"];
  const gameStatTitleList = ["게임종류", "승리", "패배", "승률"];
  const gameStatContentList = [
    "레더게임",
    "10",
    "5",
    "66.7%",
    "일반게임",
    "10",
    "5",
    "66.7%",
  ];
  const {
    isModalOpen: isInfoSettingOpen,
    onModalOpen: onInfoSettingOpen,
    onModalClose: InfoSettingClose,
  } = useModal({});

  const onAddFriend = async () => {
    const status = await createFriendUsersAPI(userId);
    console.log(`id : ${userId}, status : ${status}`);
  };
  return (
    <ModalWrapper>
      <Modal width={width} height={height}>
        <ModalTitle onClose={onClose} fontSize="3rem" height="10%">
          {myInfo.nickname}
        </ModalTitle>
        <GridWrapper>
          <MyAvatar key={myInfo.avatarUrl} src={myInfo.avatarUrl} />
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
          <CurrentLocationContent>로비에 있습니다</CurrentLocationContent>
        </GridWrapper>
        <ButtonGroup width="100%" height="8%" backgroundColor="secondary">
          {myInfo.userId === +userId ? (
            <UserInfoModalButton onClick={onInfoSettingOpen}>
              프로필설정
            </UserInfoModalButton>
          ) : (
            <>
              <UserInfoModalButton onClick={onAddFriend}>
                친구추가
              </UserInfoModalButton>
              <UserInfoModalButton>관전하기</UserInfoModalButton>
            </>
          )}
          <UserInfoModalButton to={`/stat/${userId}`}>
            최근전적
          </UserInfoModalButton>
        </ButtonGroup>
      </Modal>
      {isInfoSettingOpen && (
        <UserInfoSettingModal onClose={InfoSettingClose} info={myInfo} />
      )}
    </ModalWrapper>
  );
};

export default UserInfoModal;
