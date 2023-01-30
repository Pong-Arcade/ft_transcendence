import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

const RankTemplateStyled = styled(Board).attrs((props) => ({
  width: props.theme.template.width,
  height: props.theme.template.height,
  backgroundColor: props.theme.background.back,
  boxShadow: true,
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
}))`
  position: absolute;
`;

interface Props {
  children: React.ReactNode;
}

const RankTemplate = ({ children }: Props) => {
  return <RankTemplateStyled>{children}</RankTemplateStyled>;
};

export default RankTemplate;
