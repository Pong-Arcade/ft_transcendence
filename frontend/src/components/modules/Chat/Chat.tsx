import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import ChatList from "../../atoms/ChatList";
import Input from "../../atoms/Input";

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
  const list = [
    "kangkim : test",
    "kangkim : test",
    "kangkim : test",
    "kangkim : overflow test. overflow test. overflow test. overflow test. overflow test. overflow test. overflow test. overflow test. overflow test. ",
    "kangkim : scroll test",
    "kangkim : scroll test",
    "kangkim : scroll test",
    "kangkim : scroll test",
    "kangkim : scroll test",
    "kangkim : scroll test",
    "kangkim : scroll test",
    "kangkim : scroll test",
  ];
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
        />
      </ChatBoard>
    </ChatStyled>
  );
};

export default Chat;
