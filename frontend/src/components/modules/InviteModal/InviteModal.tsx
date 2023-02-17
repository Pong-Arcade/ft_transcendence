import { MouseEvent, useState } from "react";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ChatRoomInvitePagination from "../ChatRoomInvitePagination";
import ChatRoomInviteUserItem from "../ChatRoomInviteUserItem";
import InviteConfirmModal from "../InviteConfirmModal";
import ModalTitle from "../ModalTitle";

interface Props {
  onClose: () => void;
}

const InviteModal = ({ onClose }: Props) => {
  const [inviteList, setInviteList] = useState<string[]>([]);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (inviteList.includes(e.currentTarget.innerText)) {
      setInviteList(
        inviteList.filter((id) => id !== e.currentTarget.innerText)
      );
    } else {
      setInviteList([...inviteList, e.currentTarget.innerText]);
    }
  };

  const { isModalOpen: isConfirmOpen, onModalOpen: onConfirmOpen } = useModal(
    {}
  );
  const [page, setPage] = useState(0);

  const onInvite = () => {
    onConfirmOpen();
    // TODO: invite logic
  };
  return (
    <ModalWrapper>
      <Modal width="25%" height="70%">
        <ModalTitle onClose={onClose} fontSize="3rem" height="10%">
          초대하기
        </ModalTitle>
        <ChatRoomInvitePagination
          list={[]}
          subList={inviteList}
          onItemClick={onClick}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={ChatRoomInviteUserItem}
        />
        <Button width="50%" height="9%" onClick={onInvite}>
          초대하기
        </Button>
      </Modal>
      {isConfirmOpen && (
        <InviteConfirmModal
          count={inviteList.length}
          onClose={onClose}
          onYesConfirm={() => onClose()}
        />
      )}
    </ModalWrapper>
  );
};

export default InviteModal;
