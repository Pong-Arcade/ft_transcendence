import styled from "styled-components";
import useInfoSetting from "../../../hooks/useInfoSetting";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import GridList from "../../atoms/GridList";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ContentList from "../ContentList";
import ContentListWrapper from "../ContentListWrapper";
import ModalTitle from "../ModalTitle";
import UserInfoSettingModal from "../UserInfoSettingModal";

interface Props {
  onClose: () => void;
  width: string;
  height: string;
  me?: boolean;
}

const Info = styled(Board).attrs({
  width: "100%",
  height: "34%",
  borderRadius: true,
  justifyContent: "space-around",
})``;

const Stat = styled(Board).attrs({
  width: "100%",
  height: "34%",
  borderRadius: true,
})``;

const State = styled(Board).attrs({
  width: "100%",
  height: "10%",
  borderRadius: true,
})``;

const UserInfoModalButton = styled(Button).attrs({
  width: "30%",
  height: "75%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const UserInfoModal = ({ onClose, width, height, me }: Props) => {
  const titleList = ["이름", "가입일", "자기소개"];
  const contentList = ["kangkim", "yyyy-mm-dd", "안녕하세요"];
  const { isOpenInfoSetting, onOpenInfoSetting, onCloseInfoSetting } =
    useInfoSetting();

  return (
    <>
      <Modal width={width} height={height}>
        <ModalTitle onClose={onClose} fontSize="3rem" height="10%">
          UserId
        </ModalTitle>
        <Info>
          <Avatar width="15vw" height="15vw" />
          <ContentListWrapper width="68%" height="100%">
            <ContentList titleList={titleList} contentList={contentList} />
          </ContentListWrapper>
        </Info>
        <Stat>
          <GridList
            width="100%"
            height="100%"
            titleList={["게임종류", "승리", "패배", "승률"]}
            contentList={[
              ["레더게임", "10", "5", "66.7%"],
              ["일반게임", "10", "5", "66.7%"],
            ]}
          />
        </Stat>
        <State>
          <ContentListWrapper width="100%" height="100%">
            <ContentList
              titleList={["현재상태"]}
              contentList={["로비에 있습니다"]}
            />
          </ContentListWrapper>
        </State>
        <ButtonGroup width="100%" height="10%" backgroundColor="secondary">
          {me ? (
            <>
              <UserInfoModalButton onClick={onOpenInfoSetting}>
                프로필설정
              </UserInfoModalButton>
              <UserInfoModalButton to="/stat/1">최근전적</UserInfoModalButton>
            </>
          ) : (
            <>
              <UserInfoModalButton>친구추가</UserInfoModalButton>
              <UserInfoModalButton to="/stat/1">최근전적</UserInfoModalButton>
              <UserInfoModalButton>관전하기</UserInfoModalButton>
            </>
          )}
        </ButtonGroup>
      </Modal>
      {isOpenInfoSetting && (
        <ModalWrapper>
          <UserInfoSettingModal onClose={onCloseInfoSetting} />
        </ModalWrapper>
      )}
    </>
  );
};

export default UserInfoModal;
