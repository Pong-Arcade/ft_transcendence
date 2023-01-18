import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/buttons/Button";
import List from "../../components/ui/lists/List";
import ListElement from "../../components/ui/lists/ListElement";
import Avatar from "@mui/material/Avatar";
import LobbyBackBoard from "./components/LobbyBackboard";
import LobbyFrontBoard from "./components/LobbyFrontBoard";
import LobbyButtonGroup from "./components/LobbyButtonGroup";

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

const UserListButton = styled(Button).attrs({
  fontSize: "1.3vw",
  width: "10.5vw",
  height: "5vh",
})``;

const RankButton = styled(Button).attrs({
  fontSize: "1.3vw",
  width: "10.5vw",
  height: "5vh",
})`
  margin-top: 3vh;
`;

const UserInfo = styled.div`
  width: 50%;
  display: flex;
  gap: 0.6vh;
  font-size: 1.7vw;
`;

const Info = styled.p`
  white-space: nowrap;
`;

const UserList = styled(List)`
  height: 89%;
`;
const User = styled(ListElement)``;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
let Users: string[] = [];
for (let i = 0; i < 2; ++i) {
  Users.push("----- test user name overflow -----");
}

const LobbyLeftBoard = () => {
  return (
    <LobbyLeftBoardStyled>
      <LobbyProfile>
        <UserInfo>
          <Avatar sx={{ width: "11vw", height: "11vw", marginTop: "1vh" }} />
          <Infos>
            <Info>user1</Info>
            <Info>2 승 2 패 (50%)</Info>
            <Info>1020 점</Info>
            <RankButton>랭킹</RankButton>
          </Infos>
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
