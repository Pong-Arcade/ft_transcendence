import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { updateChatRoomAPI } from "../../../api/room";
import {
  EChatRoomFormValues,
  EChatRoomMode,
} from "../../../hooks/useChatRoomForm";
import useModal from "../../../hooks/useModal";
import useModifyChatRoomForm from "../../../hooks/useModifyChatRoomForm";
import chatRoomState from "../../../state/ChatRoomState";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalInputWrapper from "../../atoms/ModalInputWrapper";
import ModalWrapper from "../../atoms/ModalWrapper";
import FailModal from "../FailModal";
import LabledInput from "../LabledInput";
import ModalInputListWrapper from "../ModalInputListWrapper";
import ModalTitle from "../ModalTitle";
import RoomTypeCheckBoxGroup from "../RoomTypeCheckBoxGroup";
import SuccessModal from "../SuccessModal";

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

const ModifyChatRoomModal = ({ title, onClose }: Props) => {
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);
  const params = useParams();
  const { isModalOpen: isSuccessOpen, onModalOpen: onSuccessOpen } = useModal(
    {}
  );
  const { isModalOpen: isFailOpen, onModalOpen: onFailOpen } = useModal({});
  const { values, onChangeForm, onSubmitForm } = useModifyChatRoomForm({
    onSubmit: () => {
      try {
        updateChatRoomAPI(
          Number(params.chatId),
          values.title,
          values.mode,
          values.password
        );
        onSuccessOpen();
        setChatRoom((prev) => ({ ...prev, title: values.title }));

        //TODO: 채팅방 정보 변경 이벤트 발생시키기
      } catch (error) {
        onFailOpen();
      }
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
                  values.mode === EChatRoomMode.PRIVATE
                    ? "비밀방입니다."
                    : (chatRoom.title as string)
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
                placeholder={`${chatRoom.maxUserCount as number}명`}
                onChange={onChangeForm}
                type="number"
                disabled
              />
            </ModalInputWrapper>
          </ModalInputListWrapper>
          <SubmitButton>생성</SubmitButton>
        </CreateRoomForm>
      </Modal>
      {isSuccessOpen && (
        <SuccessModal
          onClose={onClose}
          title="채팅방 정보 변경"
          content="채팅방 정보 변경에 성공하였습니다"
        />
      )}
      {isFailOpen && (
        <FailModal
          onClose={onClose}
          title="채팅방 정보 변경"
          content="채팅방 정보 변경에 실패하였습니다"
        />
      )}
    </ModalWrapper>
  );
};

export default ModifyChatRoomModal;
