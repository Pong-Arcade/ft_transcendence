import React from "react";
import styled from "styled-components";
import ChatBoard from "../../components/ui/chat/ChatBoard";
import Button from "../../components/ui/buttons/Button";
import List from "../../components/ui/lists/List";
import ListElement from "../../components/ui/lists/ListElement";
import LobbyBackBoard from "./components/LobbyBackBoard";
import LobbyFrontBoard from "./components/LobbyFrontBoard";
import ChatElement from "../../components/ui/chat/ChatElement";
import ChatList from "../../components/ui/chat/ChatList";
import ChatInput from "../../components/ui/chat/ChatInput";
import LobbyButtonGroup from "./components/LobbyButtonGroup";
import RoomCreateButton from "./components/RoomCreateButton";

const LobbyRightBoardStyled = styled(LobbyBackBoard)`
  width: 69%;
`;

const LobbyMain = styled(LobbyFrontBoard)`
  height: 90%;
  flex-direction: column;
  justify-content: space-around;
`;

const RoomChoiceButton = styled(Button).attrs({
  fontSize: "2rem",
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
      <RoomCreateButton />
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
