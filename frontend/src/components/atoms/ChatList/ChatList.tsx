import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import blockUsersState from "../../../state/BlockUsersState";
import { SocketContext } from "../../../utils/ChatSocket";
import ChatListItem from "../ChatListItem";

interface Props {
  // list?: IMessage[];
  width: string;
  height: string;
  backgroundColor?: string;
  borderRadius?: string;
  gap?: string;
  fontSize?: string;
}

const ChatListStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  border-radius: ${(props) => props.borderRadius || props.theme.border.board};
  gap: ${(props) => props.gap || "0.8rem"};
  padding: 1rem;
  font-size: ${(props) => props.fontSize || "1.8rem"};
  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 1.5vw;
  }
  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colors.freshAir};
    border-radius: ${(props) => props.theme.border.board};
    border: thin solid rgba(0, 0, 0, 0.21);
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.blueCola};
    border-radius: ${(props) => props.theme.border.board};
    border: thin solid rgba(0, 0, 0, 0.21);
  }
`;

export type MessageType = "message" | "whisper" | "systemMsg";
export interface IMessage {
  fromId: number;
  content: string;
  type: MessageType;
  roomId?: number;
}

export enum EMessageType {
  MESSAGE = "message",
  WHISPER = "whisper",
  SYSTEMMSG = "systemMsg",
}

const ChatList = ({ ...rest }: Props) => {
  const [list, setList] = useState<IMessage[]>([]);
  const blockUsers = useRecoilValue(blockUsersState);
  const socket = useContext(SocketContext);
  useEffect(() => {
    const newMessage = (newMsg: IMessage) => {
      console.log(newMsg);
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
  return (
    <ChatListStyled {...rest}>
      {list.map((item, index) =>
        item.type === EMessageType.MESSAGE ? (
          <ChatListItem key={index}>{item.content}</ChatListItem>
        ) : item.type === EMessageType.WHISPER ? (
          <ChatListItem key={index} color={"#9980FA"}>
            {item.content}
          </ChatListItem>
        ) : (
          item.type === EMessageType.SYSTEMMSG && (
            <ChatListItem key={index} color={"#f39c12"}>
              {item.content}
            </ChatListItem>
          )
        )
      )}
    </ChatListStyled>
  );
};

export default ChatList;
