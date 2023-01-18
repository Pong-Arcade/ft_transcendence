import React from "react";
import styled from "styled-components";

const ChatInput = styled.input`
  width: 100%;
  height: 8%;
  font-size: 1.2rem;
  border-radius: ${(props) => props.theme.border.board};
  border: thin solid white;
  padding: 1.5vw;
  font-weight: 800;
  color: ${(props) => props.theme.colors.blueCola};
  caret-color: ${(props) => props.theme.colors.blueCola};

  &:focus {
    outline-color: ${(props) => props.theme.colors.blueCola};
  }
`;
export default ChatInput;
