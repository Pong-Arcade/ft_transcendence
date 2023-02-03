import React, { useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { ReactComponent as Logo } from "../../../assets/42logo.svg";
import Typography from "../../atoms/Typography";
import { getRequest } from "../../../utils/axios";
import ModalWrapper from "../../atoms/ModalWrapper";
import Modal from "../../atoms/Modal";
import Spinner from "../../atoms/Spinner";
import UserInfoSettingModal from "../UserInfoSettingModal";

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

// TODO: User profile, nickname 설정(api??)
// TODO: loading css 넣기
const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const result = await getRequest("api/auth/login");
      setIsLoading(false);
      if (result.status === 200) {
        // 모달창 띄우기
        setIsOpenModal(true);
        // 42 아바타, 닉네임 받아오기
        // 아바타 닉네임 설정
        // 완료 시 닉네임 유일성 확인
        // 성공 시 lobby로 이동
        // 설정 도중 취소 시 db에서 삭제 ? 또는 상태 기억
      } else {
        // 로그인 실패 모달
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setIsOpenModal(false);
    setIsLoading(false);
  };

  return (
    <>
      <LoginButtonStyled>
        <ButtonStyled onClick={onClick} disabled={isLoading}>
          <Logo width="3.5rem" height="3.5rem" />
          <Typography fontSize="3rem">Login</Typography>
        </ButtonStyled>
      </LoginButtonStyled>
      {isOpenModal && (
        <ModalWrapper onClose={onClose}>
          <UserInfoSettingModal onClose={onClose} />
        </ModalWrapper>
      )}
      {isLoading && (
        <ModalWrapper>
          <Spinner />
        </ModalWrapper>
      )}
    </>
  );
};

export default LoginButton;
