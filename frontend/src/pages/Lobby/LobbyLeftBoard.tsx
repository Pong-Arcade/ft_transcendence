import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/buttons/Button";
import List from "../../components/ui/lists/List";
import ListElement from "../../components/ui/lists/ListElement";
import Avatar from "@mui/material/Avatar";
import LobbyBackBoard from "./components/LobbyBackBoard";
import LobbyFrontBoard from "./components/LobbyFrontBoard";
import ButtonGroup from "../../components/ui/buttons/ButtonGroup";
import ContextList from "../../components/ui/lists/ContextList";
import Context from "../../components/ui/lists/Context";
import { Link } from "react-router-dom";

const LobbyLeftBoardStyled = styled(LobbyBackBoard)`
  width: 30%;
`;

// TODO: pagination 으로 개선
const LobbyUserList = styled(LobbyFrontBoard)`
  height: 70%;
  flex-direction: column;
  justify-content: space-around;
`;

const LobbyProfile = styled(LobbyFrontBoard)`
  height: 29%;
  justify-content: start;
`;

const LobbyButtonGroup = styled(ButtonGroup)``;
const UserListButton = styled(Button).attrs({
  fontSize: "1.3vw",
  width: "10.5vw",
  height: "5vh",
})``;

const RankButton = styled(Button).attrs({
  fontSize: "1.3vw",
  width: "10.5vw",
  height: "5vh",
})``;

const UserInfo = styled.div`
  width: 100%;
  display: flex;
  gap: 0.6vh;
  font-size: 1.7vw;
  height: 100%;
`;

const UserList = styled(List)`
  height: 89%;
`;
const User = styled(ListElement)``;

let Users: string[] = [];
for (let i = 0; i < 2; ++i) {
  Users.push("----- test user name overflow -----");
}

const LobbyLeftBoard = () => {
  return (
    <LobbyLeftBoardStyled>
      <LobbyProfile>
        <UserInfo>
          <Avatar sx={{ width: "45%", height: "85%", marginTop: "1vh" }} />
          <ContextList width="64%" height="100%" gap="0.5vh">
            <Context fontSize="2rem">user1</Context>
            <Context fontSize="2rem">2 승 2 패 (50%)</Context>
            <Context fontSize="2rem">1020 점</Context>
            <Link to="/rank">
              <RankButton>랭킹</RankButton>
            </Link>
          </ContextList>
        </UserInfo>
      </LobbyProfile>
      <LobbyUserList>
        <LobbyButtonGroup>
          <UserListButton>접속중인유저</UserListButton>
          <UserListButton>친구목록</UserListButton>
        </LobbyButtonGroup>
        <UserList>
          {Users.map((elem, idx) => (
            <User key={idx}>{elem}</User>
          ))}
        </UserList>
      </LobbyUserList>
    </LobbyLeftBoardStyled>
  );
};

export default LobbyLeftBoard;
