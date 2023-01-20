import React from "react";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import ChatBoard from "../../components/ui/chat/ChatBoard";
import Button from "../../components/ui/buttons/Button";
import ChatElement from "../../components/ui/chat/ChatElement";
import ChatList from "../../components/ui/chat/ChatList";
import ChatInput from "../../components/ui/chat/ChatInput";
import ButtonGroup from "../../components/ui/buttons/ButtonGroup";
import { Link } from "react-router-dom";
import UserCardList from "./UserCardList";

const ChatStyled = styled(Board)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: start;
  padding: 2vh 4vh;
  gap: 1vh;
  background-color: ${(props) => props.theme.background.back};
`;

const ChatTitle = styled(Board)`
  background-color: ${(props) => props.theme.background.middle};
  width: 100%;
  height: 8%;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
`;

const UserInfo = styled(Board)`
  background-color: ${(props) => props.theme.background.back};
  height: 95%;
  min-width: 12vw;
  padding: 2vh;
  flex-direction: column;
  justify-content: start;
  gap: 2vh;
  cursor: pointer;
`;

const UserName = styled(Board)`
  width: 100%;
  height: 50%;
  font-size: 1.5vw;
  background-color: ${(props) => props.theme.background.middle};
`;

const ChatButtonGrop = styled(ButtonGroup)``;

const ChatButton = styled(Button).attrs({
  fontSize: "2rem",
  width: "25vw",
  height: "6vh",
})``;

let chatList: string[] = [];
for (let i = 0; i < 30; ++i) {
  chatList.push("chat overflow ");
}
const Chat = () => {
  return (
    <ChatStyled>
      <ChatTitle>chatTitle</ChatTitle>
      <UserCardList />
      <ChatBoard>
        <ChatList>
          {chatList.map((elem, idx) => (
            <ChatElement key={idx}>{elem}</ChatElement>
          ))}
        </ChatList>
        <ChatInput />
      </ChatBoard>
      <ChatButtonGrop>
        <ChatButton>초대하기</ChatButton>
        <Link to="/lobby">
          <ChatButton>나가기</ChatButton>
        </Link>
      </ChatButtonGrop>
    </ChatStyled>
  );
};

export default Chat;
