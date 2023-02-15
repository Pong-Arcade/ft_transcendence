import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../components/atoms/Avatar";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import Typography from "../components/atoms/Typography";
import Chat from "../components/modules/Chat";
import ExitConfirmModal from "../components/modules/ExitConfirmModal";
import GeneralMenu from "../components/modules/GeneralMenu";
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
      <GeneralMenu
        userId={2} // TODO: 정보보기 제외 다른 기능 추가 시 리팩토링 필요
        isOpenMenu={isOpenMenu}
        onClose={onCloseMenu}
        top={positionY}
        left={positionX}
      />
      {isConfirmOpen && (
        <ExitConfirmModal
          onClose={onConfirmClose}
          onYesConfirm={() => navigate("/lobby")}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
    </>
  );
};

export default GameRoom;
