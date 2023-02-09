import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useChatRoomForm, {
  EChatRoomFormValues,
  EChatRoomType,
} from "../../../hooks/useChatRoomForm";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalInputWrapper from "../../atoms/ModalInputWrapper";
import ModalWrapper from "../../atoms/ModalWrapper";
import ErrorModal from "../ErrorModal";
import LabledInput from "../LabledInput";
import ModalInputListWrapper from "../ModalInputListWrapper";
import ModalTitle from "../ModalTitle";
import RoomTypeCheckBoxGroup from "../RoomTypeCheckBoxGroup";

interface Props {
  title?: string;
  onClose: () => void;
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

const SubmitButton = styled(Button).attrs({
  width: "30%",
  height: "10%",
  boxShadow: true,
  type: "submit",
})``;

const CreateChatRoomModal = ({ title, onClose }: Props) => {
  const navigate = useNavigate();
  const { values, errors, onErrorModalClose, onChangeForm, onSubmitForm } =
    useChatRoomForm({
      onSubmit: () => {
        onClose();
        navigate("/chat-rooms/123");
      },
    });

  return (
    <ModalWrapper>
      <Modal width="60%" height="70%">
        <CreateRoomForm onSubmit={onSubmitForm}>
          <ModalTitle onClose={onClose} fontSize="3rem">
            {title}
          </ModalTitle>
          <ModalInputListWrapper gridTemplate="repeat(4, 1fr) / 1fr">
            <ModalInputWrapper>
              <RoomTypeCheckBoxGroup
                title="방유형"
                onChange={onChangeForm}
                checked={values.Type}
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="방제목"
                name={EChatRoomFormValues.TITLE}
                value={values.Title}
                onChange={onChangeForm}
                disabled={values.Type === EChatRoomType.PRIVATE}
                type="text"
                placeholder={
                  values.Type === EChatRoomType.PRIVATE ? values.Title : ""
                }
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="비밀번호"
                name={EChatRoomFormValues.PASSWORD}
                value={values.Password}
                onChange={onChangeForm}
                disabled={values.Type !== EChatRoomType.PROTECTED}
                type="password"
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="최대인원"
                name={EChatRoomFormValues.MAXUSER}
                value={values.MaxUser}
                onChange={onChangeForm}
                type="number"
                placeholder="2 ~ 10 숫자만 입력하세요"
              />
            </ModalInputWrapper>
          </ModalInputListWrapper>
          <SubmitButton>생성</SubmitButton>
        </CreateRoomForm>
      </Modal>
      {errors && <ErrorModal onClose={onErrorModalClose} errors={errors} />}
    </ModalWrapper>
  );
};

export default CreateChatRoomModal;
