import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { acceptGameAPI, rejectGameAPI } from "../../../api/room";
import errorState from "../../../state/ErrorState";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";
import { IUser } from "../Pagination/Pagination";

interface Props {
  onClose: () => void;

  inviteUser: IUser;
}

const ConfirmButton = styled(Button).attrs({
  width: "45%",
  height: "100%",
})``;

const InviteGameModal = ({ onClose, inviteUser }: Props) => {
  const setError = useSetRecoilState(errorState);
  const onYesConfirm = async () => {
    try {
      await acceptGameAPI();
      onClose();
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  const onNoConfirm = async () => {
    try {
      await rejectGameAPI();
      onClose();
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  return (
    <ConfirmModal title="게임신청" onClose={onClose}>
      <Typography fontSize="2.8rem">
        {inviteUser.nickname}님이 게임신청을 했습니다.
      </Typography>
      <ButtonGroup width="100%" height="30%">
        <ConfirmButton onClick={onYesConfirm}>승락</ConfirmButton>
        <ConfirmButton onClick={onNoConfirm}>거절</ConfirmButton>
      </ButtonGroup>
    </ConfirmModal>
  );
};

export default InviteGameModal;
