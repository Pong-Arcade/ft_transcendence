import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { getOnlineUsersAPI } from "../../../api/users";
import useModal from "../../../hooks/useModal";
import errorState from "../../../state/ErrorState";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ChatRoomInvitePagination from "../ChatRoomInvitePagination";
import ChatRoomInviteUserItem from "../ChatRoomInviteUserItem";
import InviteConfirmModal from "../InviteConfirmModal";
import ModalTitle from "../ModalTitle";
import { IUser } from "../Pagination/Pagination";

interface Props {
  onClose: () => void;
}

const InviteModal = ({ onClose }: Props) => {
  const [inviteList, setInviteList] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const setError = useSetRecoilState(errorState);
  const getOnlineUsers = async () => {
    try {
      setOnlineUsers(await getOnlineUsersAPI());
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  useEffect(() => {
    getOnlineUsers();
  }, []);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
