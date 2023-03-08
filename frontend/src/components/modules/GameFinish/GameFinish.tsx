import { MutableRefObject } from "react";
import styled from "styled-components";
import { IScore } from "../../../event/GameEvent/gameBoardEvent";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import { IUser } from "../Pagination/Pagination";

interface Props {
  scoreRef: MutableRefObject<IScore>;
  redUser: IUser;
  blueUser: IUser;
  onClose: () => void;
}

const Wrapper = styled.div`
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const ScoreTypography = styled(Typography)`
  display: flex;
  align-items: center;
`;

const ModalButton = styled(Button).attrs({
  width: "40%",
  height: "15%",
})``;

const TeamSpan = styled.span<{ fontColor: string }>`
  color: ${(props) => props.fontColor};
  font-size: 3rem;

  margin: auto 3rem;
`;

const GameFinish = ({ scoreRef, redUser, blueUser, onClose }: Props) => {
  const score = scoreRef.current;
  return (
    <ModalWrapper onClose={onClose}>
      <Modal width="50%" height="50%" backgroundColor="#03a9f4">
        <Wrapper>
          <Typography fontSize="8rem" fontColor="#17d32a">
            {score.redScore > score.blueScore
              ? redUser.nickname
              : blueUser.nickname}{" "}
            {score.redScore === score.blueScore ? "무승부" : "승리"}
          </Typography>
          <ScoreTypography fontSize="6rem">
            <TeamSpan fontColor="red">(RED)</TeamSpan>
            {score.redScore} : {score.blueScore}
            <TeamSpan fontColor="blue">(BLUE)</TeamSpan>
          </ScoreTypography>
        </Wrapper>
        <ModalButton onClick={onClose}>닫기</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default GameFinish;
