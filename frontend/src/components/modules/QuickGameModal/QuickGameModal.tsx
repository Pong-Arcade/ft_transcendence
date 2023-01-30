import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Modal from "../../atoms/Modal";
import Spinner from "../../atoms/Spinner";
import Typography from "../../atoms/Typography";
import ModalTitle from "../ModalTitle";

interface Props {
  buttonType: string;
  onClose?: () => void;
}

const Wrapper = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "79%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    flexDirection: "column",
  };
})`
  gap: 6vh;
`;

const QuickGameModal = ({ onClose, buttonType }: Props) => {
  return (
    <Modal width="30%" height="30%">
      <ModalTitle
        onClose={onClose}
        fontSize="2rem"
        closeFontSize="1.5rem"
        height="20%"
      >
        {buttonType}
      </ModalTitle>
      <Wrapper>
        <Typography fontSize="3rem">매칭 상대를 찾고 있습니다</Typography>
        <Spinner />
      </Wrapper>
    </Modal>
  );
};

export default QuickGameModal;
