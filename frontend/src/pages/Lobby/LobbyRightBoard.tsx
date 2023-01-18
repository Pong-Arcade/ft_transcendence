import React from "react";
import styled from "styled-components";
import ChatBoard from "../../components/ui/chat/ChatBoard";
import Button from "../../components/ui/buttons/Button";
import List from "../../components/ui/lists/List";
import ListElement from "../../components/ui/lists/ListElement";
import LobbyBackBoard from "./components/LobbyBackboard";
import LobbyButtonGroup from "./components/LobbyButtonGroup";
import LobbyFrontBoard from "./components/LobbyFrontBoard";
import ChatElement from "../../components/ui/chat/ChatElement";
import ChatList from "../../components/ui/chat/ChatList";
import ChatInput from "../../components/ui/chat/ChatInput";

const LobbyRightBoardStyled = styled(LobbyBackBoard)`
  width: 69%;
`;

const LobbyGameButtons = styled(LobbyFrontBoard)`
  height: 9%;
  align-items: center;
`;

const LobbyMain = styled(LobbyFrontBoard)`
  height: 90%;
  flex-direction: column;
  justify-content: space-around;
`;

const GameButton = styled(Button).attrs({
  fontSize: "1.8vw",
  width: "17vw",
  height: "6vh",
})``;

const RoomChoiceButton = styled(Button).attrs({
  fontSize: "1.8vw",
  width: "17vw",
  height: "6vh",
})``;

const RoomList = styled(List)`
  height: 39%;
`;

const Room = styled(ListElement)``;

const LobbyChatBoard = styled(ChatBoard)``;

const LobbyChatList = styled(ChatList)``;

const LobbyChatElement = styled(ChatElement)``;
const LobbyChatInput = styled(ChatInput)``;

let roomList: string[] = [];
for (let i = 0; i < 20; ++i) {
  roomList.push(
    "---------------------------------------- test room name overflow ----------------------------------------"
  );
}

let chatList: string[] = [];
for (let i = 0; i < 30; ++i) {
  chatList.push("chat overflow ");
}

const LobbyRightBoard = () => {
  return (
    <LobbyRightBoardStyled>
      <LobbyGameButtons>
        <LobbyButtonGroup>
          <GameButton>채팅방만들기</GameButton>
          <GameButton>일반게임</GameButton>
          <GameButton>레더게임</GameButton>
        </LobbyButtonGroup>
      </LobbyGameButtons>
      <LobbyMain>
        <LobbyButtonGroup>
          <RoomChoiceButton>채팅방목록</RoomChoiceButton>
          <RoomChoiceButton>진행중인게임</RoomChoiceButton>
        </LobbyButtonGroup>
        <RoomList>
          {roomList.map((elem, idx) => (
            <Room key={idx}>{elem}</Room>
          ))}
        </RoomList>
        <LobbyChatBoard>
          <LobbyChatList>
            {chatList.map((elem, idx) => (
              <LobbyChatElement key={idx}>{elem}</LobbyChatElement>
            ))}
          </LobbyChatList>
          <LobbyChatInput />
        </LobbyChatBoard>
      </LobbyMain>
    </LobbyRightBoardStyled>
  );
};

export default LobbyRightBoard;
