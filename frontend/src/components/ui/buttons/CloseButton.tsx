import React from "react";
import styled from "styled-components";

interface ICloseButton {
  width?: string;
  height?: string;
  top?: string;
  right?: string;
}

const CloseButton = styled.button<ICloseButton>`
  background-color: ${(props) => props.theme.background.middle};
  top: ${(props) => (props.height ? props.height : "10%")};
  right: ${(props) => (props.width ? props.width : "1%")};
  font-size: 1em;
  position: absolute;
  border: none;
`;

export default CloseButton;
