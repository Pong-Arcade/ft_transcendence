import React from "react";
import styled from "styled-components";

interface IButton {
  width: string;
  height: string;
  fontSize: string;
}

const Button = styled.button<IButton>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-size: ${(props) => props.fontSize};
  background-color: ${(props) => props.theme.colors.blueCola};
  border-radius: 10px;
  color: ${(props) => props.theme.font.cultured};
  cursor: pointer;
`;

export default Button;
