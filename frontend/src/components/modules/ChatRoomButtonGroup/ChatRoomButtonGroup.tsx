import { createBrowserHistory } from "history";
import { MutableRefObject, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { joinChatRoomAPI, leaveChatRoomAPI } from "../../../api/room";
import useModal from "../../../hooks/useModal";
import chatRoomState from "../../../state/ChatRoomState";
import errorState from "../../../state/ErrorState";
import infoState from "../../../state/InfoState";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";
import ExitConfirmModal from "../ExitConfirmModal";
import InviteModal from "../InviteModal";

const ChatRoomButton = styled(Button).attrs({
  fontSize: "2rem",
  height: "7vh",
  width: "30vw",
})``;

interface Props {
  browserMoveRef: MutableRefObject<boolean>;
}

const browserHistory = createBrowserHistory();

const ChatRoomButtonGroup = ({ browserMoveRef }: Props) => {
  const setChatRoom = useSetRecoilState(chatRoomState);
  const setError = useSetRecoilState(errorState);
  const myInfo = useRecoilValue(infoState);
  const {
    isModalOpen: isConfirmOpen,
    onModalOpen: onConfirmOpen,
    onModalClose: onConfirmClose,
  } = useModal({});
  const {
    isModalOpen: isInviteOpen,
    onModalOpen: onInviteOpen,
    onModalClose: onInviteClose,
  } = useModal({});
  const navigate = useNavigate();
  const params = useParams();

  const onLeaveChatRoom = () => {
    navigate("/lobby");
    setChatRoom({ roomId: -1, title: "", mastUserId: -1, users: [] });
  };

  const onClickBackButton = async () => {
    try {
      await leaveChatRoomAPI(Number(params.chatId));
      setChatRoom((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.userId !== myInfo.userId),
      }));
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  useEffect(() => {
    const unlisten = browserHistory.listen(async ({ location, action }) => {
      if (action === "POP") {
        try {
          await joinChatRoomAPI(Number(params.chatId));
        } catch (error) {
          setError({ isError: true, error, isChangePage: true });
        }
      }
    });
    return () => {
      if (!browserMoveRef.current) onClickBackButton();
      unlisten();
    };
  }, []);
  return (
    <>
      <ButtonGroup height="7%" width="100%" backgroundColor="secondary">
        <ChatRoomButton onClick={onInviteOpen}>초대하기</ChatRoomButton>
        <ChatRoomButton onClick={onConfirmOpen}>나가기</ChatRoomButton>
      </ButtonGroup>
      {isInviteOpen && <InviteModal onClose={onInviteClose} />}
      {isConfirmOpen && (
        <ExitConfirmModal
          onClose={onConfirmClose}
          onYesConfirm={onLeaveChatRoom}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
    </>
  );
};

export default ChatRoomButtonGroup;
