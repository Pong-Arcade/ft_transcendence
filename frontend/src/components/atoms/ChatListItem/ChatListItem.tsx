import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const ChatListItemStyled = styled.p<Props>`
  word-break: normal;
`;

const ChatListItem = ({ children, ...rest }: Props) => {
  return <ChatListItemStyled {...rest}>{children}</ChatListItemStyled>;
};

export default ChatListItem;
