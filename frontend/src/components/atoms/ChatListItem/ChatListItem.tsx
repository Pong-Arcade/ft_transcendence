import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  color?: string;
}

const ChatListItemStyled = styled.p<Props>`
  word-break: normal;
  color: ${(props) => props.color && props.color};
`;

const ChatListItem = ({ children, ...rest }: Props) => {
  return <ChatListItemStyled {...rest}>{children}</ChatListItemStyled>;
};

export default ChatListItem;
