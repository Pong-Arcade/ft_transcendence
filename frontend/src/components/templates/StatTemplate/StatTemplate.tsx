import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

const RankingTemplateStyled = styled(Board).attrs((props) => ({
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

const RankingTemplate = ({ children }: Props) => {
  return <RankingTemplateStyled>{children}</RankingTemplateStyled>;
};

export default RankingTemplate;
