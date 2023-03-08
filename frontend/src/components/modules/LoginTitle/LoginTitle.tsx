import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Typography from "../../atoms/Typography";

const LoginTitleStyled = styled(Board).attrs({
  width: "100%",
  height: "60%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
})``;

const LoginTitle = () => {
  return (
    <LoginTitleStyled>
      <Typography fontSize="20rem">PONG</Typography>
      <Typography fontSize="15rem">Arcade</Typography>
    </LoginTitleStyled>
  );
};

export default LoginTitle;
