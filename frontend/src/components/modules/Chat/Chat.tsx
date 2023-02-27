import styled from "styled-components";
import Board from "../../atoms/Board";
import ChatList from "../../atoms/ChatList";
import ChatInput from "../ChatInput";

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

const Chat = ({ ...rest }: Props) => {
  return (
    <ChatStyled {...rest}>
      <ChatBoard>
        <ChatList height="87%" width="100%" />
        <ChatInput />
      </ChatBoard>
    </ChatStyled>
  );
};

export default Chat;
