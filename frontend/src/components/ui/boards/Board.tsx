import React from "react";
import styled from "styled-components";
import ScrollBarBoard from "./ScrollBarBoard";

const Board = styled(ScrollBarBoard)`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => props.theme.border.board};
`;
export default Board;
