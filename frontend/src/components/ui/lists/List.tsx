import React from "react";
import styled from "styled-components";
import ScrollBarBoard from "../boards/ScrollBarBoard";

const List = styled(ScrollBarBoard)`
  gap: 0.5vh;
  width: 100%;
  overflow-x: hidden;
  white-space: nowrap;
  background-color: ${(props) => props.theme.colors.vividCerulean};
  border-radius: ${(props) => props.theme.border.board};
  padding: 0.2vw;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export default List;
