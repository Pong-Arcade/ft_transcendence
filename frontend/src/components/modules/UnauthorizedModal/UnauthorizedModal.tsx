import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import errorState from "../../../state/ErrorState";
import { removeJWT } from "../../../utils/token";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";

const Wrapper = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    width: "100%",
    height: "51%",
    borderRadius: true,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})``;

const ErrorMessage = styled(Typography).attrs({
  fontSize: "2rem",
})`
  color: yellow;
`;

const ModalButton = styled(Button).attrs({
  width: "50%",
  height: "20%",
})``;

const UnauthorizedModal = () => {
  const navigate = useNavigate();
  const setError = useSetRecoilState(errorState);

  const onClose = () => {
    navigate("/");
    removeJWT();
    setError({ isError: false, error: null });
  };

  return (
    <ModalWrapper backgroundColor="black">
      <Modal width="30%" height="30%">
        <ModalTitle onClose={onClose} height="25%" fontSize="2rem">
          로그인 인증 필요
        </ModalTitle>
        <Wrapper>
          <ErrorMessage>로그인이 필요한 서비스입니다</ErrorMessage>
        </Wrapper>
        <ModalButton onClick={onClose}>로그인 화면으로</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default UnauthorizedModal;
