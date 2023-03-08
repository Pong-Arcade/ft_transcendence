import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { verify2FAAPI } from "../api/auth";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Typography from "../components/atoms/Typography";
import FailModal from "../components/modules/FailModal";
import LoginTitle from "../components/modules/LoginTitle";
import SuccessModal from "../components/modules/SuccessModal";
import LoginTemplate from "../components/templates/LoginTemplate";
import useModal from "../hooks/useModal";
import { setJWT } from "../utils/token";

const Login2FAForm = styled(Board).attrs({
  borderRadius: true,
  boxShadow: true,
})`
  width: 30%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: ${(props) => props.theme.background.back};
`;

const Login2FAInput = styled(Input).attrs({
  borderRadius: true,
})`
  width: 80%;
  height: 40%;
`;

const Login2FA = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    isModalOpen: isSuccessOpen,
    onModalOpen: onSuccessOpen,
    onModalClose: onSuccessClose,
  } = useModal({
    afterClose: () => {
      navigate("/lobby");
    },
  });

  const {
    isModalOpen: isFailOpen,
    onModalOpen: onFailOpen,
    onModalClose: onFailClose,
  } = useModal({});

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit2FA = async () => {
    if (!inputRef.current || inputRef.current.value === "") {
      onFailOpen();
      return;
    }
    try {
      const value = inputRef.current.value.trim();
      const response = await verify2FAAPI(value);
      setJWT(response.data.token);
      onSuccessOpen();
    } catch {
      onFailOpen();
    }
  };

  return (
    <>
      <LoginTemplate>
        <LoginTitle />
        <Login2FAForm width="30%" height="60%">
          <Typography fontSize="3rem">인증번호 입력</Typography>
          <Login2FAInput ref={inputRef} />
          <Button width="50%" height="20%" onClick={onSubmit2FA}>
            인증
          </Button>
        </Login2FAForm>
      </LoginTemplate>
      {isSuccessOpen && (
        <SuccessModal
          onClose={onSuccessClose}
          title={"인증"}
          content={"인증에 성공하였습니다"}
        />
      )}
      {isFailOpen && (
        <FailModal
          onClose={onFailClose}
          title={"인증"}
          content={"인증에 실패하였습니다"}
        />
      )}
    </>
  );
};

export default Login2FA;
