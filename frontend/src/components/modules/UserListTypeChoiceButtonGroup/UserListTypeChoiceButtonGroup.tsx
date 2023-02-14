import styled from "styled-components";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";

interface Props {
  onClick: (button: EUSER_BUTTON) => void;
  currentButton?: EUSER_BUTTON;
}

export enum EUSER_BUTTON {
  ONLINE_USERS = "접속중인유저",
  FRIEND_USERS = "친구목록",
  BLOCK_USERS = "차단목록",
}
export const BUTTON_LIST = [
  EUSER_BUTTON.ONLINE_USERS,
  EUSER_BUTTON.FRIEND_USERS,
  EUSER_BUTTON.BLOCK_USERS,
];

const ChoiceButton = styled(Button).attrs({
  width: "31%",
  height: "55%",
  boxShadow: true,
})``;

const UserListTypeChoiceButtonGroup = ({ onClick, currentButton }: Props) => {
  return (
    <ButtonGroup width="100%" height="15%" alignItems="center">
      {BUTTON_LIST.map((title) => (
        <ChoiceButton
          key={title}
          onClick={() => onClick(title)}
          disabled={currentButton === title}
        >
          {title}
        </ChoiceButton>
      ))}
    </ButtonGroup>
  );
};

export default UserListTypeChoiceButtonGroup;
