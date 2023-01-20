import React from "react";
import styled from "styled-components";
import Board from "../../../components/ui/boards/Board";

const LobbyFrontBoard = styled(Board)`
  background-color: ${(props) => props.theme.background.middle};
  width: 99%;
  padding: 2vh;
`;

export default LobbyFrontBoard;
