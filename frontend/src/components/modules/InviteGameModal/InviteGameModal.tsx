import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { acceptGameAPI, rejectGameAPI } from "../../../api/room";
import errorState from "../../../state/ErrorState";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";
import { IUser } from "../Pagination/Pagination";

interface Props {
  onClose: () => void;
  inviteUser: IUser;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const MyAvatar = styled(Avatar).attrs({
  width: "14vw",
  height: "14vw",
})``;

const GameStatTitle = styled(Board).attrs({
  borderRadius: true,
  height: "20%",
})`
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
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(4, 1fr);
  text-align: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.middle};
`;

const GameStatWrapper = styled(Board)`
  flex-direction: column;
  height: 40%;
`;

const InviteGameModal = ({ onClose, inviteUser }: Props) => {
  const setError = useSetRecoilState(errorState);
  const onYesConfirm = async () => {
    try {
      await acceptGameAPI();
      onClose();
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  const onNoConfirm = async () => {
    try {
      await rejectGameAPI();
      onClose();
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  const gameStatTitleList = ["게임종류", "승리", "패배", "승률"];
  const gameStatContentList = [
    "레더게임",
    inviteUser.ladderInfo?.winCount,
    inviteUser.ladderInfo?.loseCount,
    `${inviteUser.ladderInfo?.winRate}%`,
    "일반게임",
    inviteUser.normalInfo?.winCount,
    inviteUser.normalInfo?.loseCount,
    `${inviteUser.normalInfo?.winRate}%`,
  ];

  return (
    <ConfirmModal
      title="게임신청"
      onClose={onNoConfirm}
      width="50%"
      height="90%"
      titleHeight="10%"
      contextHeight="89%"
    >
      <MyAvatar src={inviteUser.avatarUrl} />
      <Typography fontSize="2.8rem">
        {inviteUser.nickname}님이 게임신청을 했습니다.
      </Typography>
      <GameStatWrapper>
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
      </GameStatWrapper>
      <ButtonGroup width="100%" height="10%">
        <ConfirmButton onClick={onYesConfirm}>승락</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>거절</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default InviteGameModal;
