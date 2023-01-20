import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/buttons/Button";
import ButtonGroup from "../../components/ui/buttons/ButtonGroup";
import ModalUserInfo from "../../components/ui/modals/ModalUserInfo";
import LobbyFrontBoard from "./components/LobbyFrontBoard";
import UserList from "./UserList";

const LobbyUserListStyled = styled(LobbyFrontBoard)`
  height: 70%;
  flex-direction: column;
  justify-content: space-around;
`;

const LobbyButtonGroup = styled(ButtonGroup)``;
const UserListButton = styled(Button).attrs({
  fontSize: "1.3vw",
  width: "10.5vw",
  height: "5vh",
})``;

const LobbyUserList = () => {
  return (
    <LobbyUserListStyled>
      <LobbyButtonGroup>
        <UserListButton>접속중인유저</UserListButton>
        <UserListButton>친구목록</UserListButton>
      </LobbyButtonGroup>
      <UserList />
    </LobbyUserListStyled>
  );
};

export default LobbyUserList;
