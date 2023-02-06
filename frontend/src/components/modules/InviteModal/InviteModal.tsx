import { MouseEvent, useEffect } from "react";
import useConfirm from "../../../hooks/useConfirm";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ConfirmModal from "../ConfirmModal";
import { EConfirmType } from "../ConfirmModal/ConfirmModal";
import ModalTitle from "../ModalTitle";
import PaginationList from "../PaginationList";

interface Props {
  onClose: () => void;
}

let inviteList: string[];
const InviteModal = ({ onClose }: Props) => {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.value) {
      e.currentTarget.value = "";
      inviteList = inviteList.filter((id) => id !== e.currentTarget.innerText);
      e.currentTarget.style.backgroundColor = "#0288d1";
    } else {
      e.currentTarget.value = "checked";
      inviteList.push(e.currentTarget.innerText);
      e.currentTarget.style.backgroundColor = "#b3e5fc";
    }
  };

  useEffect(() => {
    inviteList = [];
  }, []);

  const { isOpenConfirm, onOpenConfirm, onCloseConfirm } = useConfirm();
  const onInvite = () => {
    onOpenConfirm();
  };
  const onCloseInviteModal = () => {
    inviteList = [];
    onClose();
  };

  return (
    <>
      <Modal width="25%" height="60%">
        <ModalTitle onClose={onClose} fontSize="3rem" height="15%">
          초대하기
        </ModalTitle>
        <PaginationList
          list={["1", "2", "3", "4", "5", "6", "", "", "", ""]}
          display="grid"
          gridTemplate="repeat(5, 1fr) / 1fr"
          width="100%"
          height="73%"
          onClick={onClick}
        />
        <Button width="50%" height="10%" onClick={onInvite}>
          초대하기
        </Button>
      </Modal>
      {isOpenConfirm && (
        <ModalWrapper onClose={onCloseInviteModal}>
          <ConfirmModal
            content={inviteList.length}
            onClose={onCloseConfirm}
            type={EConfirmType.INVITE}
            onYesConfirm={onCloseInviteModal}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default InviteModal;
