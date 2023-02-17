import styled from "styled-components";
import { MyInfoState } from "../../../state/myInfoState";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ModalTitle from "../ModalTitle";

interface Props {
  onClose: () => void;
  onSubmit?: () => void;
  info: MyInfoState;
}

const Wrapper = styled(Board).attrs((props) => {
  return {
    height: "83%",
    width: "100%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})``;

const SubmitButton = styled(Button).attrs({
  width: "50%",
  height: "16%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const NicknameInput = styled(Input).attrs({
  height: "15%",
  width: "70%",
  borderRadius: true,
  padding: "1rem",
})`
  text-align: center;
`;

const UserInfoSettingModal = ({ onClose, onSubmit, info }: Props) => {
  if (info.userId === -1) return null;
  return (
    <ModalWrapper>
      <Modal width="30%" height="60%" animation>
        <ModalTitle onClose={onClose} fontSize="3rem">
          프로필설정
        </ModalTitle>
        <Wrapper>
          <Avatar width="15vw" height="15vw" upload src={info.avatarUrl} />
          <NicknameInput defaultValue={info.nickname} />
          <SubmitButton onClick={onSubmit}>설정완료</SubmitButton>
        </Wrapper>
      </Modal>
    </ModalWrapper>
  );
};

export default UserInfoSettingModal;
