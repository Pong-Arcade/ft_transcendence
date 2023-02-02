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
import NumberInput from "../../atoms/NumberInput";
import PasswordInput from "../../atoms/PasswordInput";
import TextInput from "../../atoms/TextInput";
import ModalInputListWrapper from "../ModalInputListWrapper";
import ModalTitle from "../ModalTitle";
import RoomTypeCheckBoxGroup from "../RoomTypeCheckBoxGroup";
import { ERoomTypeCheckBoxTitle } from "../RoomTypeCheckBoxGroup/RoomTypeCheckBoxGroup";

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

const CreateChatRoomModal = ({ title, onClose }: Props) => {
  // TODO: validate와 submitting 시 할 작업 추가
  const { values, errors, submitting, onChangeForm, onSubmitForm } =
    useCreateRoomForm({
      initialValues: {
        Type: "Public",
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
    <Modal width="60%" height="70%">
      <CreateRoomForm onSubmit={onSubmitForm}>
        <ModalTitle onClose={onClose} fontSize="3rem">
          {title}
        </ModalTitle>
        <ModalInputListWrapper gridTemplate="repeat(4, 1fr) / 1fr">
          <ModalInputWrapper>
            <RoomTypeCheckBoxGroup title="방유형" onChange={onChangeForm} />
          </ModalInputWrapper>
          <ModalInputWrapper>
            <TextInput
              title="방제목"
              name={ECreateRoomFormValues.TITLE}
              value={values.Title}
              onChange={onChangeForm}
              disabled={values.Type === ERoomTypeCheckBoxTitle.PRIVATE}
            />
          </ModalInputWrapper>
          <ModalInputWrapper>
            <PasswordInput
              title="비밀번호"
              name={ECreateRoomFormValues.PASSWORD}
              value={values.Password}
              onChange={onChangeForm}
              disabled={values.Type !== ERoomTypeCheckBoxTitle.PROTECTED}
            />
          </ModalInputWrapper>
          <ModalInputWrapper>
            <NumberInput
              title="최대인원"
              name={ECreateRoomFormValues.MAXUSER}
              value={values.maxUser}
              onChange={onChangeForm}
            />
          </ModalInputWrapper>
        </ModalInputListWrapper>
        <Button width="30%" height="10%" boxShadow type="submit">
          생성
        </Button>
      </CreateRoomForm>
    </Modal>
  );
};

export default CreateChatRoomModal;
