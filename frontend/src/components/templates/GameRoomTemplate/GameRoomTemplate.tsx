import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

const GameRoomTemplateStyled = styled(Board).attrs((props) => ({
  width: props.theme.template.width,
  height: props.theme.template.height,
  backgroundColor: props.theme.background.back,
  boxShadow: true,
  borderRadius: true,
  justifyContent: "space-around",
}))``;

interface Props {
  children: React.ReactNode;
}

const GameRoomTemplate = ({ children }: Props) => {
  return <GameRoomTemplateStyled>{children}</GameRoomTemplateStyled>;
};

export default GameRoomTemplate;
