import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { ReactComponent as Logo } from "../../../assets/42logo.svg";
import Typography from "../../atoms/Typography";
import { loginAPI } from "../../../api/auth";
import FullSpinner from "../../atoms/FullSpinner";
import useLoading from "../../../hooks/useLoading";

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
  const { isLoading, startLoading } = useLoading({
    afterStartLoading: () => loginAPI(),
  });

  return (
    <>
      <LoginButtonStyled>
        <ButtonStyled onClick={startLoading}>
          <Logo width="3.5rem" height="3.5rem" />
          <Typography fontSize="3rem">Login</Typography>
        </ButtonStyled>
      </LoginButtonStyled>
      {isLoading && <FullSpinner />}
    </>
  );
};

export default LoginButton;
