import styled from "styled-components";
import useCreateRoomForm, {
  ECreateRoomFormValidate,
  ECreateRoomFormValues,
} from "../../../hooks/useCreateRoomForm";
import createRoomFormValidate from "../../../utils/createRoomFormValidate";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalInputWrapper from "../../atoms/ModalInputWrapper";
import LabledInput from "../LabledInput";
import ModalInputListWrapper from "../ModalInputListWrapper";
import ModalTitle from "../ModalTitle";

interface Props {
  title?: string;
  onClose?: () => void;
}

const CreateRoomForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CreateGameRoomModal = ({ title, onClose }: Props) => {
  // TODO: errors, submitting 인자 받기
  const { values, onChangeForm, onSubmitForm } = useCreateRoomForm({
    initialValues: {
      Title: "",
      maxUser: "",
    },
    onSubmit: (values) => {
      console.log("----- Submit result -----");
      console.log(values);
      onClose && onClose();
    },
    validate: createRoomFormValidate,
    roomType: ECreateRoomFormValidate.GAME,
  });

  return (
    <Modal width="50%" height="40%">
      <CreateRoomForm onSubmit={onSubmitForm}>
        <ModalTitle onClose={onClose} fontSize="3rem" height="20%">
          {title}
        </ModalTitle>
        <ModalInputListWrapper height="62%" gridTemplate="repeat(2, 1fr) / 1fr">
          <ModalInputWrapper>
            <LabledInput
              title="방제목"
              name={ECreateRoomFormValues.TITLE}
              value={values.Title}
              onChange={onChangeForm}
              type="text"
            />
          </ModalInputWrapper>
          <ModalInputWrapper>
            <LabledInput
              title="최대인원"
              name={ECreateRoomFormValues.MAXUSER}
              value={values.maxUser}
              onChange={onChangeForm}
              type="number"
            />
          </ModalInputWrapper>
        </ModalInputListWrapper>
        <Button width="30%" height="15%" boxShadow type="submit">
          생성
        </Button>
      </CreateRoomForm>
    </Modal>
  );
};

export default CreateGameRoomModal;
