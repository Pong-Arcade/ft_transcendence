import styled from "styled-components";
import Board from "../../atoms/Board";
import GameChatList from "../../atoms/GameChatList";
import GameInput from "../GameInput";

interface Props {
  width: string;
  height: string;
  boxShadow?: boolean;
}

const ChatStyled = styled(Board).attrs((props) => {
  return {
    width: props.width,
    height: props.height,
    backgroundColor: props.theme.background.front,
    flexDirection: "column",
    justifyContent: "space-evenly",
    borderRadius: true,
    boxShadow: props.boxShadow || false,
  };
})<Props>``;

const ChatBoard = styled(Board).attrs({
  width: "98%",
  height: "96%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "start",
})``;

const GameChat = ({ ...rest }: Props) => {
  return (
    <ChatStyled {...rest}>
      <ChatBoard>
        <GameChatList height="87%" width="100%" />
        <GameInput />
      </ChatBoard>
    </ChatStyled>
  );
};

export default GameChat;
