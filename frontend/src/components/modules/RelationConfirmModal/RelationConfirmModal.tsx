import styled from "styled-components";
import useRelation from "../../../hooks/useRelation";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";
import { ECurrentOn, EMenu } from "../GeneralMenu/GeneralMenu";

interface Props {
  onNoConfirm: () => void;
  onClose: () => void;
  currentOn?: ECurrentOn;
  userId: string;
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

const RelationConfirmModal = ({
  onNoConfirm,
  onClose,
  currentOn,
  userId,
  name,
}: Props) => {
  const { onAddFriend, onDelFriend, onAddBlock, onDelBlock } =
    useRelation(userId);
  let title = "";
  let content = "";
  let onYesConfirm = () => {
    return;
  };

  switch (currentOn) {
    case ECurrentOn.ADD_FRIEND:
      title = EMenu.ADD_FRIEND;
      content = `정말 ${name}님을 친구추가하시겠습니까?`;
      onYesConfirm = onAddFriend;
      break;
    case ECurrentOn.DEL_FRIEND:
      title = EMenu.DEL_FRIEND;
      content = `정말 ${name}님을 친구삭제하시겠습니까?`;
      onYesConfirm = onDelFriend;
      break;
    case ECurrentOn.ADD_BLOCK:
      title = EMenu.ADD_BLOCK;
      content = `정말 ${name}님을 차단하시겠습니까?`;
      onYesConfirm = onAddBlock;
      break;
    case ECurrentOn.DEL_BLOCK:
      title = EMenu.DEL_BLOCK;
      content = `정말 ${name}님을 차단해제하시겠습니까?`;
      onYesConfirm = onDelBlock;
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

export default RelationConfirmModal;
