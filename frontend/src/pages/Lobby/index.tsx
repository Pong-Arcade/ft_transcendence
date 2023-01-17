import React from "react";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import LobbyLeftBoard from "./LobbyLeftBoard";
import LobbyRightBoard from "./LobbyRightBoard";

const LobbyStyled = styled(Board)`
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

const Lobby = () => {
  return (
    <LobbyStyled>
      <LobbyLeftBoard />
      <LobbyRightBoard />
    </LobbyStyled>
  );
};

export default Lobby;
