import React from "react";
import styled from "styled-components";

const ChatBoard = styled.div`
  background-color: ${(props) => props.theme.colors.blueCola};
  border-radius: ${(props) => props.theme.border.board};
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export default ChatBoard;
