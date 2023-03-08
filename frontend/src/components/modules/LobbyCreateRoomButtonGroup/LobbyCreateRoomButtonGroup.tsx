import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinQuickMatchAPI, leaveQuickMatchAPI } from "../../../api/room";
import useCreateRoom, {
  ERoomCreateButtonName,
} from "../../../hooks/useCreateRoom";
import { EGameType } from "../../../hooks/useGameRoomForm";
import useModal from "../../../hooks/useModal";
import errorState from "../../../state/ErrorState";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";
import ChooseGameModal from "../ChooseGameModal";
import CreateChatRoomModal from "../CreateChatRoomModal";
import CreateGameRoomModal from "../CreateGameRoomModal";
import QuickGameModal from "../QuickGameModal";

const CreateRoomButton = styled(Button).attrs({
  width: "25%",
  height: "70%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const LobbyCreateRoomButtonGroup = () => {
  const { isOpenModal, buttonTitle, roomCreateList, onCreateButton, onClose } =
    useCreateRoom();
  const setError = useSetRecoilState(errorState);
  const {
    isModalOpen: isCreateGameOpen,
    onModalOpen: onCreateGameOpen,
    onModalClose: onCreateGameClose,
  } = useModal({
    beforeOpen: () => {
      onClose();
    },
  });
  const {
    isModalOpen: isQuickMatchOpen,
    onModalOpen: onQuickMatchOpen,
    onModalClose: onQuickMatchClose,
  } = useModal({
    beforeOpen: async () => {
      try {
        onClose();
        if (buttonTitle === "레더게임")
          await joinQuickMatchAPI(EGameType.LADDER);
        else await joinQuickMatchAPI(EGameType.NORMAL);
      } catch (error) {
        setError({ isError: true, error });
      }
    },
  });

  const leaveQuickMatch = async () => {
    try {
      await leaveQuickMatchAPI();
      onQuickMatchClose();
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  return (
    <>
      <ButtonGroup height="10%" width="100%" boxShadow>
        {roomCreateList.map((title) => (
          <CreateRoomButton key={title} onClick={onCreateButton}>
            {title}
          </CreateRoomButton>
        ))}
      </ButtonGroup>
      {isOpenModal && (
        <>
          {buttonTitle === ERoomCreateButtonName.CHATROOM ? (
            <CreateChatRoomModal
              onClose={onClose}
              title={ERoomCreateButtonName.CHATROOM}
            />
          ) : (
            <ChooseGameModal
              onClose={onClose}
              onQuickMatchOpen={onQuickMatchOpen}
              onCreateGameOpen={onCreateGameOpen}
              title={buttonTitle}
            />
          )}
        </>
      )}
      {isCreateGameOpen && (
        <CreateGameRoomModal title={buttonTitle} onClose={onCreateGameClose} />
      )}
      {isQuickMatchOpen && (
        <QuickGameModal onClose={leaveQuickMatch} title={buttonTitle} />
      )}
    </>
  );
};

export default LobbyCreateRoomButtonGroup;
