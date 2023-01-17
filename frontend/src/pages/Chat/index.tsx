import { Avatar } from "@mui/material";
import React from "react";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import ChatBoard from "../../components/ui/chat/ChatBoard";
import Button from "../../components/ui/buttons/Button";
import ChatElement from "../../components/ui/chat/ChatElement";
import ChatList from "../../components/ui/chat/ChatList";
import ChatInput from "../../components/ui/chat/ChatInput";

const ChatStyled = styled(Board)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: start;
  padding: 2vh 4vh;
  gap: 2vh;
`;

const ChatTitle = styled(Board)`
  background-color: ${(props) => props.theme.colors.freshAir};
  width: 100%;
  height: 8%;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
`;

const UserInfos = styled(Board)`
  background-color: ${(props) => props.theme.colors.vividCerulean};
  width: 100%;
  height: 35%;
  justify-content: start;
  padding: 1vh 2vh;
  gap: 1vh;
  overflow-x: auto;
`;

const UserInfo = styled(Board)`
  background-color: ${(props) => props.theme.colors.freshAir};
  height: 95%;
  min-width: 12vw;
  padding: 2vh;
  flex-direction: column;
  justify-content: start;
  gap: 2vh;
`;

const UserName = styled(Board)`
  width: 100%;
  height: 50%;
  font-size: 1.5vw;
  background-color: ${(props) => props.theme.colors.vividCerulean};
`;

const ChatChatBoard = styled(ChatBoard)``;
const ChatChatList = styled(ChatList)``;
const ChatChatElement = styled(ChatElement)``;
const ChatChatInput = styled(ChatInput)``;

let userList: string[] = [
  "kangkim",
  "kangkim2",
  "kangkim3",
  "kangkim4",
  "kangkim5",
  "kangkim6",
  "kangkim7",
  "kangkim7",
  "kangkim7",
];

let chatList: string[] = [];
for (let i = 0; i < 30; ++i) {
  chatList.push("chat overflow ");
}

const ChatButtonGrop = styled.div`
  display: flex;
  justify-content: space-around;
  width: 90%;
`;

const ChatButton = styled(Button).attrs({
  fontSize: "1.8vw",
  width: "25vw",
  height: "6vh",
})``;

const Chat = () => {
  return (
    <ChatStyled>
      <ChatTitle>chatTitle</ChatTitle>
      <UserInfos>
        {userList.map((elem, idx) => (
          <UserInfo key={idx}>
            <Avatar sx={{ width: "8vw", height: "8vw" }} />
            <UserName>{elem}</UserName>
          </UserInfo>
        ))}
      </UserInfos>
      <ChatChatBoard>
        <ChatChatList>
          {chatList.map((elem, idx) => (
            <ChatChatElement key={idx}>{elem}</ChatChatElement>
          ))}
        </ChatChatList>
        <ChatChatInput />
      </ChatChatBoard>
      <ChatButtonGrop>
        <ChatButton>초대하기</ChatButton>
        <ChatButton>나가기</ChatButton>
      </ChatButtonGrop>
    </ChatStyled>
  );
};

export default Chat;
