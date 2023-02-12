import styled from "styled-components";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";

interface Props {
  onClick: (button: EROOM_BUTTON) => void;
  currentButton?: EROOM_BUTTON;
}

export enum EROOM_BUTTON {
  CHATROOM = "채팅방목록",
  GAMEROOM = "게임방목록",
}
export const BUTTON_LIST = [EROOM_BUTTON.CHATROOM, EROOM_BUTTON.GAMEROOM];

const ChoiceButton = styled(Button).attrs({
  width: "31%",
  height: "75%",
  boxShadow: true,
})``;

const LobbyRoomListTypeChoiceButtonGroup = ({
  onClick,
  currentButton,
}: Props) => {
  return (
    <ButtonGroup width="100%" height="20%" justifyContent="center" gap="11vw">
      {BUTTON_LIST.map((title, idx) => (
        <ChoiceButton
          key={idx}
          onClick={() => onClick(title)}
          disabled={currentButton === title}
        >
          {title}
        </ChoiceButton>
      ))}
    </ButtonGroup>
  );
};

export default LobbyRoomListTypeChoiceButtonGroup;
