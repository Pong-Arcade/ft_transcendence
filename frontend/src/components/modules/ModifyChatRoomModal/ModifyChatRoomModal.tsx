import React from "react";
import styled from "styled-components";
import useCreateRoomForm, {
  ECreateRoomFormValidate,
  ECreateRoomFormValues,
} from "../../../hooks/useCreateRoomForm";
import createRoomFormValidate from "../../../utils/createRoomFormValidate";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalInputWrapper from "../../atoms/ModalInputWrapper";
import PasswordInput from "../../atoms/PasswordInput";
import ModalInputListWrapper from "../ModalInputListWrapper";
import ModalTitle from "../ModalTitle";
import RoomTypeCheckBoxGroup from "../RoomTypeCheckBoxGroup";
import { EChatRoomType } from "../RoomTypeCheckBoxGroup/RoomTypeCheckBoxGroup";

interface Props {
  title?: string;
  onClose?: () => void;
}

const CreateRoomForm = styled.form.attrs((props) => {
  return {
    onsubmit: props.onSubmit && props.onSubmit,
  };
})`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

// TODO: 리팩토링 blank box size
const CreateChatRoomModal = ({ title, onClose }: Props) => {
  // TODO: errors, submitting 인자 받기
  const { values, onChangeForm, onSubmitForm } = useCreateRoomForm({
    initialValues: {
      Type: EChatRoomType.PUBLIC,
      Title: "",
      Password: "",
      maxUser: "",
    },
    onSubmit: (values) => {
      console.log("----- Submit result -----");
      console.log(values);
      onClose && onClose();
    },
    validate: createRoomFormValidate,
    roomType: ECreateRoomFormValidate.CHAT,
  });

  return (
    <Modal width="50%" height="50%">
      <CreateRoomForm onSubmit={onSubmitForm}>
        <ModalTitle onClose={onClose} fontSize="3rem">
          {title}
        </ModalTitle>
        <ModalInputListWrapper height="67%" gridTemplate="repeat(2, 1fr) / 1fr">
          <ModalInputWrapper>
            <RoomTypeCheckBoxGroup title="방유형" onChange={onChangeForm} />
          </ModalInputWrapper>
          <ModalInputWrapper>
            <PasswordInput
              title="비밀번호"
              name={ECreateRoomFormValues.PASSWORD}
              value={values.Password}
              onChange={onChangeForm}
              disabled={values.Type !== EChatRoomType.PROTECTED}
            />
          </ModalInputWrapper>
        </ModalInputListWrapper>
        <Button width="30%" height="15%" boxShadow type="submit">
          수정
        </Button>
      </CreateRoomForm>
    </Modal>
  );
};

export default CreateChatRoomModal;
