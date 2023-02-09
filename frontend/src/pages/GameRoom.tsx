import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../components/atoms/Avatar";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import Typography from "../components/atoms/Typography";
import Chat from "../components/modules/Chat";
import ConfirmModal from "../components/modules/ConfirmModal";
import { EConfirmType } from "../components/modules/ConfirmModal/ConfirmModal";
import Menu from "../components/modules/Menu";
import UserInfoModal from "../components/modules/UserInfoModal";
import GameRoomTemplate from "../components/templates/GameRoomTemplate";
import useMenu from "../hooks/useMenu";
import useModal from "../hooks/useModal";

const GameBoard = styled(Board).attrs((props) => {
  return {
    width: "75%",
    height: "98%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    boxShadow: true,
  };
})``;
const Wrapper = styled(Board).attrs({
  width: "24%",
  height: "98%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const UserProfileGroup = styled(Board).attrs({
  width: "98%",
  height: "35%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;
const UserProfile = styled(Button).attrs({
  width: "98%",
  height: "49%",
  boxShadow: true,
})`
  background-color: ${(props) => props.theme.background.middle};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const GameRoom = () => {
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY } =
    useMenu();

  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({
    afterOpen: () => {
      onCloseMenu();
    },
  });
  const {
    isModalOpen: isConfirmOpen,
    onModalOpen: onConfirmOpen,
    onModalClose: onConfirmClose,
  } = useModal({});
  const navigate = useNavigate();

  const userList = ["kangkim1", "kangkim2"];

  return (
    <>
      <GameRoomTemplate>
        <GameBoard></GameBoard>
        <Wrapper>
          <UserProfileGroup>
            {userList.map((user, idx) => (
              <UserProfile key={idx} onClick={onOpenMenu}>
                <Avatar width="8rem" height="8rem" />
                <Typography fontSize="2rem">{user}</Typography>
                <Typography fontSize="1.2rem">
                  {idx === 0 ? "(RED)" : "(BLUE)"}
                </Typography>
              </UserProfile>
            ))}
          </UserProfileGroup>
          <Chat width="98%" height="57%" />
          <Button width="22vw" height="6vh" boxShadow onClick={onConfirmOpen}>
            나가기
          </Button>
        </Wrapper>
      </GameRoomTemplate>
      {isOpenMenu && ( // TODO: 정보보기 제외 다른 기능 추가 시 리팩토링 필요
        <Menu
          list={["정보보기", "귓속말", "친구추가", "차단하기"]}
          top={positionY}
          left={positionX}
          onOpen={onUserInfoOpen}
        />
      )}
      {isUserInfoOpen && (
        <UserInfoModal onClose={onUserInfoClose} width="50%" height="90%" />
      )}
      {isConfirmOpen && (
        <ConfirmModal
          onClose={onConfirmClose}
          type={EConfirmType.EXIT}
          onYesConfirm={() => navigate("/lobby")}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
    </>
  );
};

export default GameRoom;
