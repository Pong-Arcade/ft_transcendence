import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import blockUsersState from "../../../state/BlockUsersState";
import GameSocket from "../../../state/GameSocket";
import { SocketContext } from "../../../utils/ChatSocket";
import ChatListItem from "../ChatListItem";

interface Props {
  width: string;
  height: string;
  backgroundColor?: string;
  borderRadius?: string;
  gap?: string;
  fontSize?: string;
}

const GameChatListStyled = styled.div<Props>`
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

const GameChatList = ({ ...rest }: Props) => {
  const [list, setList] = useState<IMessage[]>([]);
  const blockUsers = useRecoilValue(blockUsersState);
  const socket = useContext(GameSocket);
  const chatSocket = useContext(SocketContext);

  useEffect(() => {
    const newMessage = (newMsg: IMessage) => {
      for (const user of blockUsers) {
        if (user.userId == newMsg.fromId) return;
      }
      setList((prevList) => [...prevList, newMsg]);
    };
    socket.socket.on("message", newMessage);
    chatSocket.socket.on("whisper", newMessage);
    socket.socket.on("systemMsg", newMessage);

    return () => {
      socket.socket.off("message", newMessage);
      chatSocket.socket.off("whisper", newMessage);
      socket.socket.off("systemMsg", newMessage);
    };
  }, [blockUsers]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  });

  return (
    <GameChatListStyled {...rest} ref={scrollRef}>
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
    </GameChatListStyled>
  );
};

export default GameChatList;
