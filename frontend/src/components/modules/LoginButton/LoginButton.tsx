import React, { useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { ReactComponent as Logo } from "../../../assets/42logo.svg";
import Typography from "../../atoms/Typography";
import ModalWrapper from "../../atoms/ModalWrapper";
import Spinner from "../../atoms/Spinner";

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

const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    window.location.replace(`${process.env.REACT_APP_API_URL}/api/auth/login`);
  };

  return (
    <>
      <LoginButtonStyled>
        <ButtonStyled onClick={onClick} disabled={isLoading}>
          <Logo width="3.5rem" height="3.5rem" />
          <Typography fontSize="3rem">Login</Typography>
        </ButtonStyled>
      </LoginButtonStyled>
      {isLoading && (
        <ModalWrapper>
          <Spinner />
        </ModalWrapper>
      )}
    </>
  );
};

export default LoginButton;
