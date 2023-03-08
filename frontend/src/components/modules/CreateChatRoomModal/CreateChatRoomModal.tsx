import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { createChatRoomAPI } from "../../../api/room";
import useChatRoomForm, {
  EChatRoomFormValues,
  EChatRoomMode,
} from "../../../hooks/useChatRoomForm";
import chatRoomState from "../../../state/ChatRoomState";
import errorState from "../../../state/ErrorState";
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
  const setChatRoomState = useSetRecoilState(chatRoomState);
  const setError = useSetRecoilState(errorState);
  const { values, errors, onErrorModalClose, onChangeForm, onSubmitForm } =
    useChatRoomForm({
      onSubmit: () => {
        (async () => {
          try {
            const response = await createChatRoomAPI(values);
            setChatRoomState(response.data);
            onClose();
            navigate(`/chat-rooms/${response.data.roomId}`);
          } catch (error) {
            setError({ isError: true, error });
          }
        })();
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
                checked={values.mode}
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="방제목"
                name={EChatRoomFormValues.TITLE}
                value={values.title}
                onChange={onChangeForm}
                type="text"
                placeholder={
                  values.mode === EChatRoomMode.PRIVATE ? "비밀방입니다." : ""
                }
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="비밀번호"
                name={EChatRoomFormValues.PASSWORD}
                value={values.password}
                onChange={onChangeForm}
                disabled={values.mode !== EChatRoomMode.PROTECTED}
                type="password"
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="최대인원"
                name={EChatRoomFormValues.MAXUSER_COUNT}
                value={values.maxUserCount}
                onChange={onChangeForm}
                type="number"
                placeholder="2 ~ 10 숫자만 입력하세요"
              />
            </ModalInputWrapper>
          </ModalInputListWrapper>
          <SubmitButton>생성</SubmitButton>
        </CreateRoomForm>
      </Modal>
      {Object.keys(errors).length && (
        <ErrorModal
          onClose={onErrorModalClose}
          errors={errors}
          title="방만들기 실패"
        />
      )}
    </ModalWrapper>
  );
};

export default CreateChatRoomModal;
