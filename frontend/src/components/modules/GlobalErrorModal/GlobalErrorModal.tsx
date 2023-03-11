import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import errorState from "../../../state/ErrorState";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import InternalServerErrorModal from "../InternalServerErrorModal";
import ModalTitle from "../ModalTitle";
import UnauthorizedModal from "../UnauthorizedModal";

interface Props {
  errors: any;
}

const Wrapper = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    width: "100%",
    height: "66.5%",
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
  height: "15%",
})``;

const GlobalErrorModal = ({ errors }: Props) => {
  const setError = useSetRecoilState(errorState);
  const navigate = useNavigate();

  const onClose = () => {
    setError({ isError: false, error: null });
  };
  const onStayCurrentPage = () => {
    setError({ isError: false, error: null });
  };
  const onMoveLobbyPage = () => {
    setError({ isError: false, error: null });
    navigate("/lobby");
  };

  if (errors.error.response?.status === 401) {
    return <UnauthorizedModal />;
  }

  if (errors.error.response?.status === 500) {
    return (
      <InternalServerErrorModal
        message={errors.error.response?.data.message as string}
      />
    );
  }

  const status = (errors.isChangePage && 404) || errors.error.response?.status;
  const message = errors.error.response?.data.message || errors.error.message;
  // const message = errors.error.response?.data.message || errors.error;

  return (
    <ModalWrapper>
      <Modal width="30%" height="40%">
        <ModalTitle onClose={onClose} height="15%" fontSize="2rem">
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
        </Wrapper>
        <ModalButton
          onClick={status === 404 ? onMoveLobbyPage : onStayCurrentPage}
        >
          확인
        </ModalButton>
      </Modal>
    </ModalWrapper>
  );
};

export default GlobalErrorModal;
