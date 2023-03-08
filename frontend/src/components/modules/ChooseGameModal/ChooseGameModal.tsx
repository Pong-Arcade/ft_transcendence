import styled from "styled-components";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ModalTitle from "../ModalTitle";

interface Props {
  title: string;
  onClose: () => void;
  onQuickMatchOpen: () => void;
  onCreateGameOpen: () => void;
}

const ChooseGameButton = styled(Button).attrs({
  width: "49.5%",
  height: "100%",
  fontSize: "2rem",
})``;

const ChooseGameModal = ({
  title,
  onClose,
  onQuickMatchOpen,
  onCreateGameOpen,
}: Props) => {
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle
          onClose={onClose}
          fontSize="2rem"
          closeFontSize="1.5rem"
          height="20%"
        >
          {title}
        </ModalTitle>
        <ButtonGroup
          height="79%"
          width="100%"
          backgroundColor="secondary"
          justifyContent="space-between"
        >
          <ChooseGameButton onClick={onCreateGameOpen}>
            방만들기
          </ChooseGameButton>
          <ChooseGameButton onClick={onQuickMatchOpen}>
            빠른시작
          </ChooseGameButton>
        </ButtonGroup>
      </Modal>
    </ModalWrapper>
  );
};

export default ChooseGameModal;
