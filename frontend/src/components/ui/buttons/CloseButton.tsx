import React from "react";
import styled from "styled-components";

interface ICloseButton {
  // fontSize?: string;
  width?: string;
  height?: string;
  top?: string;
  right?: string;
}
// font-size: ${(props) => (props.fontSize ? props.fontSize : "1.5vw")};

const CloseButton = styled.button<ICloseButton>`
  background-color: ${(props) => props.theme.background.middle};
  top: ${(props) => (props.height ? props.height : "10%")};
  right: ${(props) => (props.width ? props.width : "1%")};
  font-size: 1em;
  position: absolute;
  border: none;
`;

export default CloseButton;
