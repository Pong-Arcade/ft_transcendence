import React from "react";
import styled from "styled-components";
import ChatListItem from "../ChatListItem";

interface Props {
  list?: React.ReactNode[];
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

const ChatList = ({ list, ...rest }: Props) => {
  if (!list) return <ChatListStyled {...rest}></ChatListStyled>;
  return (
    <ChatListStyled {...rest}>
      {list.map((item, index) => {
        return <ChatListItem key={index}>{item}</ChatListItem>;
      })}
    </ChatListStyled>
  );
};

export default ChatList;
