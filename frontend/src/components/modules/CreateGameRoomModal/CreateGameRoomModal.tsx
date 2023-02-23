import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { createGameRoomAPI } from "../../../api/room";
import { ERoomCreateButtonName } from "../../../hooks/useCreateRoom";
import useGameRoomForm, {
  EGameRoomFormValues,
  EGameType,
} from "../../../hooks/useGameRoomForm";
import gameRoomState from "../../../state/GameRoomState";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalInputWrapper from "../../atoms/ModalInputWrapper";
import ErrorModal from "../ErrorModal";
import GameTypeCheckBoxGroup from "../GameTypeCheckBoxGroup/GameTypeCheckBoxGroup";
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
  height: "10%",
  boxShadow: true,
  type: "submit",
})``;

const CreateGameRoomModal = ({ title, onClose }: Props) => {
  const navigate = useNavigate();
  const setGameRoomState = useSetRecoilState(gameRoomState);
  const { values, errors, onErrorModalClose, onChangeForm, onSubmitForm } =
    useGameRoomForm({
      onSubmit: async () => {
        let data;
        if (title === ERoomCreateButtonName.LADDERGAME)
          data = await createGameRoomAPI(EGameType.NORMAL, values);
        else data = await createGameRoomAPI(EGameType.LADDER, values);
        onClose();
        console.log(data);
        setGameRoomState({
          roomId: data.roomId,
          users: [data.redUser, data.blueUser],
        });
        navigate(`/game-rooms/${data.roomId}`);
      },
    });

  return (
    <>
      <Modal width="60%" height="70%">
        <CreateRoomForm onSubmit={onSubmitForm}>
          <ModalTitle onClose={onClose} fontSize="3rem">
            {title}
          </ModalTitle>
          <ModalInputListWrapper gridTemplate="repeat(4, 1fr) / 1fr">
            <ModalInputWrapper>
              <GameTypeCheckBoxGroup
                title="게임유형"
                onChange={onChangeForm}
                checked={values.mode}
              />
            </ModalInputWrapper>
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
                placeholder="1점 이상 입력하세요"
                title="승리점수"
                name={EGameRoomFormValues.WINSCORE}
                value={values.winScore}
                onChange={onChangeForm}
                type="number"
              />
            </ModalInputWrapper>
            <ModalInputWrapper>
              <LabledInput
                title="최대인원"
                name={EGameRoomFormValues.MAX_SPECTATOR_COUNT}
                value={values.maxSpectatorCount}
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
    </>
  );
};

export default CreateGameRoomModal;
