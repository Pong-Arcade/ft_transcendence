import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import errorState from "../../../state/ErrorState";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";
import UnauthorizedModal from "../UnauthorizedModal";

interface Props {
  errors: any;
}

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

const GlobalErrorModal = ({ errors }: Props) => {
  console.log(errors);
  const setError = useSetRecoilState(errorState);
  const navigate = useNavigate();

  const onClose = () => {
    setError({ isError: false, error: null });
  };
  const onClick = () => {
    setError({ isError: false, error: null });
    navigate("/lobby");
  };

  if (!errors.error.response || errors.error.response.status === 401) {
    return <UnauthorizedModal />;
  }
  const message = errors.error.response.data.message;

  return (
    <ModalWrapper>
      <Modal width="40%" height="40%">
        <ModalTitle onClose={onClose} height="25%" fontSize="2rem">
          문제 발생
        </ModalTitle>
        <Wrapper>
          {message instanceof Array ? (
            message.map((error: string, idx: number) => (
              <ErrorMessage key={idx}>{error}</ErrorMessage>
            ))
          ) : (
            <ErrorMessage>{message}</ErrorMessage>
          )}
          <ErrorMessage>로비로 이동</ErrorMessage>
        </Wrapper>
        <ModalButton onClick={onClick}>확인</ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default GlobalErrorModal;
