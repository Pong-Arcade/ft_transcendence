import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useGameRoomForm, {
  EGameRoomFormValues,
} from "../../../hooks/useGameRoomForm";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalInputWrapper from "../../atoms/ModalInputWrapper";
import ErrorModal from "../ErrorModal";
import LabledInput from "../LabledInput";
import ModalInputListWrapper from "../ModalInputListWrapper";
import ModalTitle from "../ModalTitle";

interface Props {
  title?: string;
  onClose: () => void;
}

const CreateRoomForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SubmitButton = styled(Button).attrs({
  width: "30%",
  height: "15%",
  boxShadow: true,
  type: "submit",
})``;

const CreateGameRoomModal = ({ title, onClose }: Props) => {
  const navigate = useNavigate();
  const { values, errors, onErrorModalClose, onChangeForm, onSubmitForm } =
    useGameRoomForm({
      onSubmit: () => {
        onClose();
        navigate("/game-rooms/123");
      },
    });

  return (
    <>
      <Modal width="50%" height="40%">
        <CreateRoomForm onSubmit={onSubmitForm}>
          <ModalTitle onClose={onClose} fontSize="3rem" height="20%">
            {title}
          </ModalTitle>
          <ModalInputListWrapper
            height="62%"
            gridTemplate="repeat(2, 1fr) / 1fr"
          >
            <ModalInputWrapper>
              <LabledInput
                title="방제목"
                name={EGameRoomFormValues.TITLE}
                value={values.title}
                onChange={onChangeForm}
                type="text"
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="최대인원"
                name={EGameRoomFormValues.MAXUSER}
                value={values.maxUserCount}
                onChange={onChangeForm}
                type="number"
              />
            </ModalInputWrapper>
          </ModalInputListWrapper>
          <SubmitButton>생성</SubmitButton>
        </CreateRoomForm>
      </Modal>
      {errors && <ErrorModal onClose={onErrorModalClose} errors={errors} />}
    </>
  );
};

export default CreateGameRoomModal;
