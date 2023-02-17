import React from "react";
import styled from "styled-components";
import Button from "../Button";

interface Props {
  width?: string;
  height?: string;
  top?: string;
  right?: string;
  fontSize?: string;
  onClose?: () => void;
}
const CloseButtonStyled = styled(Button).attrs((props) => {
  return {
    width: props.width || "2.2rem",
    height: props.height || "2.2rem",
    backgroundColor: "transparent",
    fontSize: props.fontSize || "2rem",
  };
})<Props>`
  position: absolute;
  top: ${(props) => props.top || "0.3vh"};
  right: ${(props) => props.right || "0.3vw"};
  border: none;
`;

const CloseButton = ({ onClose, ...rest }: Props) => {
  return (
    <CloseButtonStyled onClick={onClose} {...rest}>
      X
    </CloseButtonStyled>
  );
};

export default CloseButton;
