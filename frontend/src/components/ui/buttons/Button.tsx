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
  background-color: ${(props) => props.theme.colors.spiroDiscoBall};
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  &:hover {
    box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
    background-color: ${(props) => props.theme.colors.blueCola};
  }
`;

export default Button;
