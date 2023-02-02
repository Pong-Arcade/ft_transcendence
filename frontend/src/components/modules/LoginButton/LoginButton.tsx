import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { ReactComponent as Logo } from "../../../assets/42logo.svg";
import Typography from "../../atoms/Typography";
import { Link } from "react-router-dom";

const LoginButtonStyled = styled(Board).attrs({
  width: "50%",
  height: "25%",
})``;

const ButtonStyled = styled(Button).attrs({
  width: "30vw",
  height: "10vh",
  fontSize: "3rem",
})`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

// TODO: Login api 추가
// TODO: User profile, nickname 설정(api??)
const LoginButton = () => {
  return (
    <LoginButtonStyled>
      <Link to="/lobby">
        <ButtonStyled>
          <Logo width="3.5rem" height="3.5rem" />
          <Typography fontSize="3rem">Login</Typography>
        </ButtonStyled>
      </Link>
    </LoginButtonStyled>
  );
};

export default LoginButton;
