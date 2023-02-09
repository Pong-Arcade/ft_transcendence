import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { ReactComponent as Logo } from "../../../assets/42logo.svg";
import Typography from "../../atoms/Typography";
import { loginAPI } from "../../../api/auth";
import LoadingState from "../../../state/LoadingState";
import { useSetRecoilState } from "recoil";

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
  const setIsLoading = useSetRecoilState(LoadingState);

  const onClick = () => {
    setIsLoading(true);
    loginAPI();
  };

  return (
    <LoginButtonStyled>
      <ButtonStyled onClick={onClick}>
        <Logo width="3.5rem" height="3.5rem" />
        <Typography fontSize="3rem">Login</Typography>
      </ButtonStyled>
    </LoginButtonStyled>
  );
};

export default LoginButton;
