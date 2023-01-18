import React from "react";
import styled from "styled-components";

const ScrollBarBoard = styled.div`
  &::-webkit-scrollbar {
    width: 1.5vw;
  }
  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colors.freshAir};
    border-radius: ${(props) => props.theme.border.board};
    border: thin solid rgba(0, 0, 0, 0.21);
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.blueCola};
    border-radius: ${(props) => props.theme.border.board};
    border: thin solid rgba(0, 0, 0, 0.21);
  }
`;
export default ScrollBarBoard;
