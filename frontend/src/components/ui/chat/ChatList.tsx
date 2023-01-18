import React from "react";
import styled from "styled-components";
import ScrollBarBoard from "../boards/ScrollBarBoard";

const ChatList = styled(ScrollBarBoard)`
  height: 100%;
  padding: 2vh;
  gap: 1vh;

  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export default ChatList;
