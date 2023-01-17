import React from "react";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import Button from "../../components/ui/buttons/Button";
import { ReactComponent as Logo } from "../../assets/42logo.svg";

const LoginStyled = styled(Board)`
  flex-direction: column;
  background-color: #4bcffa;
  height: 100%;
  width: 100%;
`;

interface ITitle {
  fontSize: string;
}

const Title = styled.p<ITitle>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.theme.font.white};
`;

const LoginButton = styled(Button)`
  margin-top: 10vh;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const LoginLogo = styled(Logo)`
  width: 5vw;
  height: 5vh;
  border-radius: 10px;
  margin-right: 4vw;
`;

const Login = () => {
  return (
    <LoginStyled>
      <Title fontSize={"20vw"}>PONG</Title>
      <Title fontSize={"15vw"}>Arcade</Title>
      <LoginButton width={"30vw"} height={"6vh"} fontSize={"2vw"}>
        <LoginLogo />
        Login with 42
      </LoginButton>
    </LoginStyled>
  );
};

export default Login;
