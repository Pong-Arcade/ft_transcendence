import React from "react";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import Button from "../../components/ui/buttons/Button";
import { ReactComponent as Logo } from "../../assets/42logo.svg";
import { Link } from "react-router-dom";

const LoginStyled = styled(Board)`
  flex-direction: column;
  background-color: ${(props) => props.theme.background.back};
  height: 100%;
  width: 100%;
`;

interface ITitle {
  fontSize: string;
}

// TODO: login 글씨 입체 효과
const Title = styled.p<ITitle>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.theme.colors.blueCola};
`;

const LoginButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginLogo = styled(Logo)`
  width: 4vw;
  height: 4vh;
  border-radius: ${(props) => props.theme.border.board};
`;

const Login = () => {
  return (
    <LoginStyled>
      <Title fontSize={"20vw"}>PONG</Title>
      <Title fontSize={"15vw"}>Arcade</Title>
      <Link to="/lobby">
        <LoginButton width={"32vw"} height={"8vh"} fontSize={"3vw"}>
          <LoginLogo />
          로그인
        </LoginButton>
      </Link>
    </LoginStyled>
  );
};

export default Login;