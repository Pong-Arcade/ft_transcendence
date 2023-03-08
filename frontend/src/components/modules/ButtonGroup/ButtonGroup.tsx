import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  width: string;
  height: string;
  backgroundColor?: "primary" | "secondary";
  justifyContent?: string;
  alignItems?: string;
  boxShadow?: boolean;
  gap?: string;
  flexDirection?: string;
}

const ButtonGroupStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor === "secondary"
      ? props.theme.background.back
      : props.theme.background.middle};
  display: flex;
  justify-content: ${(props) => props.justifyContent || "space-around"};
  align-items: ${(props) => props.alignItems || "center"};
  border-radius: ${(props) => props.theme.border.board};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  gap: ${(props) => props.gap || "0"};
  flex-direction: ${(props) => props.flexDirection || "row"};
`;

const ButtonGroup = ({ children, ...rest }: Props) => {
  return <ButtonGroupStyled {...rest}>{children}</ButtonGroupStyled>;
};

export default ButtonGroup;
