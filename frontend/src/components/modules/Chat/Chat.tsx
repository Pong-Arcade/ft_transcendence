import React, { useEffect, KeyboardEvent, useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import ChatList from "../../atoms/ChatList";
import Input from "../../atoms/Input";
import ChatSocket from "../../../utils/ChatSocket";
import { IMessage } from "../../atoms/ChatList/ChatList";
import { useRecoilValue } from "recoil";
import blockUsersState from "../../../state/BlockUsersState";
import { IUser } from "../Pagination/Pagination";

interface Props {
  width: string;
  height: string;
  boxShadow?: boolean;
  socket?: ChatSocket;
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

const Chat = ({ socket, ...rest }: Props) => {
  const [list, setList] = useState<IMessage[]>([]);
  const [msg, setMsg] = useState<string>();
  const blockUsers = useRecoilValue(blockUsersState);
  useEffect(() => {
    // const joinRoom = (newMsg: IMessage) => {
    //   setList((prevList) => [...prevList, newMsg]);
    // };
    const newMessage = (newMsg: IMessage) => {
      for (const user of blockUsers) {
        if (user.userId == newMsg.fromId) return;
      }
      setList((prevList) => [...prevList, newMsg]);
    };
    if (socket) {
      socket.socket.off("message");
      socket.socket.off("whisper");
      socket.socket.off("systemMsg");
      socket.socket.on("message", newMessage);
      socket.socket.on("whisper", newMessage);
      socket.socket.on("systemMsg", newMessage);
    }
  }, [blockUsers]);

  const enterkey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !msg || msg === "" || !socket) return;

    if (msg.split(" ")[0] === "/w") {
      socket.socket.emit("whisper", {
        fromName: socket.userName,
        toName: msg.split(" ")[1],
        msg: msg.substring(msg.split(" ")[1].length + 4),
      });
    } else {
      console.log(msg);
      socket.socket.emit("message", {
        roomId: 0,
        userId: socket.userId,
        userName: socket.userName,
        msg: socket.userName + ": " + msg,
      });
    }
    setMsg("");
  };

  return (
    <ChatStyled {...rest}>
      <ChatBoard>
        <ChatList list={list} height="87%" width="100%" />
        <Input
          width="100%"
          height="10%"
          borderRadius
          padding="1rem"
          fontSize="1.5rem"
          onKeyPress={enterkey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMsg(e.target.value)
          }
          value={msg ? msg : ""}
        />
      </ChatBoard>
    </ChatStyled>
  );
};

export default Chat;
