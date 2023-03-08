import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

const LobbyTemplateStyled = styled(Board).attrs((props) => {
  return {
    width: props.theme.template.width,
    height: props.theme.template.height,
    backgroundColor: props.theme.background.back,
    boxShadow: true,
    borderRadius: true,
    justifyContent: "space-evenly",
  };
})``;

interface Props {
  children: React.ReactNode;
}

const LobbyTemplate = ({ children }: Props) => {
  return <LobbyTemplateStyled>{children}</LobbyTemplateStyled>;
};

export default LobbyTemplate;
