import imageCompression from "browser-image-compression";
import { ChangeEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getUserInfoAPI, updateUserInfoAPI } from "../../../api/users";
import errorState from "../../../state/ErrorState";
import infoState from "../../../state/InfoState";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ModalTitle from "../ModalTitle";
import { IUser } from "../Pagination/Pagination";

interface Props {
  onClose: () => void;
  info: IUser;
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

interface IUserInfo {
  nickname: string;
  avatarImage?: File;
}

const UserInfoSettingModal = ({ onClose, info }: Props) => {
  if (info.userId === -1 || !info.nickname || info.avatarUrl === undefined)
    return null;

  const [userInfo, setUserInfo] = useState<IUserInfo>({
    nickname: info.nickname,
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(info.avatarUrl);
  const setMyInfo = useSetRecoilState(infoState);
  const setError = useSetRecoilState(errorState);

  const onSubmit = async () => {
    try {
      if (userInfo.avatarImage) {
        const options = {
          maxWidthOrHeight: 200,
        };

        const compressedFile = await imageCompression(
          userInfo.avatarImage,
          options
        );
        await updateUserInfoAPI(userInfo.nickname, compressedFile);
      } else {
        await updateUserInfoAPI(userInfo.nickname);
      }
      setMyInfo(await getUserInfoAPI(info.userId as number));
      onClose();
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  const onChangeUserInfo = async (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.type) {
      case "text":
        setUserInfo((prev) => ({ ...prev, nickname: e.target.value }));
        break;
      case "file":
        const imageFile = e.target.files?.[0];
        if (!imageFile) return;

        setUserInfo((prev) => ({ ...prev, avatarImage: imageFile }));
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => {
          setAvatarUrl(reader.result as string);
        };
        break;
    }
  };

  return (
    <ModalWrapper>
      <Modal width="30%" height="60%" animation>
        <ModalTitle onClose={onClose} fontSize="3rem">
          프로필설정
        </ModalTitle>
        <Wrapper>
          <Avatar
            width="15vw"
            height="15vw"
            upload
            onChange={onChangeUserInfo}
            src={avatarUrl}
          />
          <NicknameInput
            onChange={onChangeUserInfo}
            value={userInfo.nickname}
          />
          <SubmitButton onClick={onSubmit}>설정완료</SubmitButton>
        </Wrapper>
      </Modal>
    </ModalWrapper>
  );
};

export default UserInfoSettingModal;
