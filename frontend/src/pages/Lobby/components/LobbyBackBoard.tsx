import React from "react";
import styled from "styled-components";
import Board from "../../../components/ui/boards/Board";

const LobbyBackBoard = styled(Board)`
  background-color: ${(props) => props.theme.background.back};
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 1vh;
`;

export default LobbyBackBoard;
