import React, { useContext } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import ChatList from "../../atoms/ChatList";
// import Input from "../../atoms/Input";
import { SocketContext } from "../../../utils/ChatSocket";
// import { IMessage } from "../../atoms/ChatList/ChatList";
// import { useRecoilValue } from "recoil";
// import blockUsersState from "../../../state/BlockUsersState";
// import { IUser } from "../Pagination/Pagination";
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
  const socket = useContext(SocketContext);

  return (
    <SocketContext.Provider value={socket}>
      <ChatStyled {...rest}>
        <ChatBoard>
          <ChatList height="87%" width="100%" />
          <ChatInput />
        </ChatBoard>
      </ChatStyled>
    </SocketContext.Provider>
  );
};

export default Chat;
