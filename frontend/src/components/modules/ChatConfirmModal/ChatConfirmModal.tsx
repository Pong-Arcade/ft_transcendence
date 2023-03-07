import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  banChatRoomAPI,
  demoteAdminAPI,
  muteChatRoomAPI,
  unmuteChatRoomAPI,
  promoteAdminAPI,
} from "../../../api/room";
import useRelation from "../../../hooks/useRelation";
import errorState from "../../../state/ErrorState";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import { EChatCurrentOn } from "../ChatRoomMenu/ChatRoomMenu";
import ConfirmModal from "../ConfirmModal";
import { EGeneralCurrentOn, EMenu } from "../GeneralMenu/GeneralMenu";

interface Props {
  onNoConfirm: () => void;
  onClose: () => void;
  currentOn?: EChatCurrentOn | EGeneralCurrentOn;
  userId: number;
  name: string;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const Content = styled(Typography).attrs({
  fontSize: "3rem",
})`
  text-align: center;
  width: 80%;
  white-space: break-spaces;
`;

const ChatConfirmModal = ({
  onNoConfirm,
  onClose,
  currentOn,
  userId,
  name,
}: Props) => {
  const setError = useSetRecoilState(errorState);

  const { onAddFriend, onDelFriend, onAddBlock, onDelBlock } =
    useRelation(userId);
  const onAddAdmin = async () => {
    try {
      await promoteAdminAPI(Number(params.chatId), userId);
    } catch (error: any) {
      onClose();
      setError({ isError: true, error });
    }
  };
  const onDelAdmin = async () => {
    try {
      await demoteAdminAPI(Number(params.chatId), userId);
    } catch (error: any) {
      onClose();
      setError({ isError: true, error });
    }
  };
  const onMuteUser = async () => {
    try {
      await muteChatRoomAPI(Number(params.chatId), userId);
    } catch (error: any) {
      onClose();
      setError({ isError: true, error });
    }
  };
  const onUnmuteUser = async () => {
    try {
      await unmuteChatRoomAPI(Number(params.chatId), userId);
    } catch (error: any) {
      onClose();
      setError({ isError: true, error });
    }
  };
  const onBanUser = async () => {
    try {
      await banChatRoomAPI(Number(params.chatId), userId);
    } catch (error: any) {
      onClose();
      setError({ isError: true, error });
    }
  };
  let title = "";
  let content = "";
  const params = useParams();
  let onYesConfirm = () => {
    return;
  };

  switch (currentOn) {
    case EChatCurrentOn.ADD_FRIEND:
      title = EMenu.ADD_FRIEND;
      content = `${name}님을 친구추가하시겠습니까?`;
      onYesConfirm = onAddFriend;
      break;
    case EChatCurrentOn.DEL_FRIEND:
      title = EMenu.DEL_FRIEND;
      content = `${name}님을 친구삭제하시겠습니까?`;
      onYesConfirm = onDelFriend;
      break;
    case EChatCurrentOn.ADD_BLOCK:
      title = EMenu.ADD_BLOCK;
      content = `${name}님을 차단하시겠습니까?`;
      onYesConfirm = onAddBlock;
      break;
    case EChatCurrentOn.DEL_BLOCK:
      title = EMenu.DEL_BLOCK;
      content = `${name}님을 차단해제하시겠습니까?`;
      onYesConfirm = onDelBlock;
      break;
    case EChatCurrentOn.BAN:
      title = EChatCurrentOn.BAN;
      content = `${name}님을 추방하시겠습니까?`;
      onYesConfirm = onBanUser;
      break;
    case EChatCurrentOn.PROMOTE:
      title = EChatCurrentOn.PROMOTE;
      content = `${name}님을 관리자로 승격하시겠습니까?`;
      onYesConfirm = onAddAdmin;
      break;
    case EChatCurrentOn.DEMOTE:
      title = EChatCurrentOn.DEMOTE;
      content = `${name}님을 관리자에서 해임하시겠습니까?`;
      onYesConfirm = onDelAdmin;
      break;
    case EChatCurrentOn.MUTE:
      title = EChatCurrentOn.MUTE;
      content = `${name}님을 채팅금지하시겠습니까?`;
      onYesConfirm = onMuteUser;
      break;
    case EChatCurrentOn.UNMUTE:
      title = EChatCurrentOn.UNMUTE;
      content = `${name}님의 채팅금지를 해제하시겠습니까?`;
      onYesConfirm = onUnmuteUser;
      break;
  }
  const onClick = () => {
    onYesConfirm();
    onClose();
  };
  return (
    <ConfirmModal title={title} onClose={onNoConfirm}>
      <Content>{content}</Content>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onClick}>예</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>아니오</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default ChatConfirmModal;
