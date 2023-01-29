import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import Button from "../../components/ui/buttons/Button";
import ChatBoard from "../../components/ui/chat/ChatBoard";
import ChatElement from "../../components/ui/chat/ChatElement";
import ChatInput from "../../components/ui/chat/ChatInput";
import ChatList from "../../components/ui/chat/ChatList";

const GameStyled = styled(Board)`
  height: 100%;
  width: 100%;
  justify-content: space-between;
`;
const GameLeftBoard = styled(Board)`
  background-color: ${(props) => props.theme.background.middle};
  width: 79.5%;
  height: 100%;
  color: white;
`;
const GameRightBoard = styled(Board)`
  background-color: ${(props) => props.theme.background.back};
  height: 100%;
  width: 20%;
  flex-direction: column;
  justify-content: space-around;
`;

const GameUserList = styled(Board)`
  width: 97%;
  height: 28%;
  background-color: ${(props) => props.theme.background.middle};
  flex-direction: column;
  gap: 0.5vh;
`;
const GameUser = styled(Board)`
  background-color: ${(props) => props.theme.background.front};
  height: 48%;
  width: 97%;
  justify-content: space-around;
`;

const Info = styled.p`
  white-space: nowrap;
  font-size: 1.5rem;
`;

const GameChatBoard = styled(ChatBoard)`
  height: 55%;
  width: 99%;
`;
const GameChatList = styled(ChatList)``;
const GameChatElement = styled(ChatElement)``;
const GameChatInput = styled(ChatInput)``;

const GameExitButton = styled(Button).attrs({
  fontSize: "1.3vw",
  width: "15vw",
  height: "5vh",
})``;

let chatList: string[] = [];
for (let i = 0; i < 30; ++i) {
  chatList.push("chat overflow ");
}

const Game = () => {
  return (
    <GameStyled>
      <GameLeftBoard>game board</GameLeftBoard>
      <GameRightBoard>
        <GameUserList>
          <GameUser>
            <Avatar sx={{ width: "6vw", height: "6vw" }} />
            <Info>user1</Info>
            <Info>(Left)</Info>
          </GameUser>
          <GameUser>
            <Avatar sx={{ width: "6vw", height: "6vw" }} />
            <Info>user1</Info>
            <Info>(Right)</Info>
          </GameUser>
        </GameUserList>
        <GameChatBoard>
          <GameChatList>
            {chatList.map((elem, idx) => (
              <GameChatElement key={idx}>{elem}</GameChatElement>
            ))}
          </GameChatList>
          <GameChatInput />
        </GameChatBoard>
        <Link to="/lobby">
          <GameExitButton>나가기</GameExitButton>
        </Link>
      </GameRightBoard>
    </GameStyled>
  );
};

export default Game;