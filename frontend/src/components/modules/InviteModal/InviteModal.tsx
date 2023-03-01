import { useEffect, useState } from "react";
import { getOnlineUsersAPI } from "../../../api/users";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ChatRoomInvitePagination from "../ChatRoomInvitePagination";
import ChatRoomInviteUserItem from "../ChatRoomInviteUserItem";
import InviteConfirmModal from "../InviteConfirmModal";
import ModalTitle from "../ModalTitle";
import { IUser } from "../Pagination/Pagination";

interface Props {
  list: IUser[] | Promise<IUser[]>;
  onClose: () => void;
}

const InviteModal = ({ list, onClose }: Props) => {
  const [inviteList, setInviteList] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const getOnlineUsers = async () => {
    setOnlineUsers(await getOnlineUsersAPI());
  };
  useEffect(() => {
    getOnlineUsers();
  }, []);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("event: ", e.currentTarget.id);
    if (inviteList.includes(e.currentTarget.id)) {
      setInviteList(inviteList.filter((id) => id !== e.currentTarget.id));
    } else {
      setInviteList([...inviteList, e.currentTarget.id]);
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
          list={onlineUsers}
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
          list={inviteList}
          onClose={onClose}
          onYesConfirm={() => onClose()}
        />
      )}
    </ModalWrapper>
  );
};

export default InviteModal;
