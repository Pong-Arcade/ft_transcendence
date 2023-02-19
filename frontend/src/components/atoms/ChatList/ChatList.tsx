import React from "react";
import styled from "styled-components";
import ChatListItem from "../ChatListItem";

interface Props {
  list?: IMessage[];
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
  fromId: string;
  content: string;
  type: MessageType;
}

export enum EMessageType {
  MESSAGE = "message",
  WHISPER = "whisper",
  SYSTEMMSG = "systemMsg",
}

const ChatList = ({ list, ...rest }: Props) => {
  if (!list) return <ChatListStyled {...rest}></ChatListStyled>;

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
