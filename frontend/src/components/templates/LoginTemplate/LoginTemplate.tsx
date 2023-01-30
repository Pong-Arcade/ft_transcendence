import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

const LoginTemplateStyled = styled(Board).attrs((props) => ({
  width: props.theme.template.width,
  height: props.theme.template.height,
  backgroundColor: props.theme.background.middle,
  flexDirection: "column",
  boxShadow: true,
  borderRadius: true,
}))``;

interface Props {
  children: React.ReactNode;
}

const LoginTemplate = ({ children }: Props) => {
  return <LoginTemplateStyled>{children}</LoginTemplateStyled>;
};

export default LoginTemplate;
