import styled from "styled-components";
import Board from "../../atoms/Board";

const ChatRoomTemplateStyled = styled(Board).attrs((props) => ({
  width: props.theme.template.width,
  height: props.theme.template.height,
  backgroundColor: props.theme.background.back,
  boxShadow: true,
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
}))`
  position: absolute;
`;

interface Props {
  children: React.ReactNode;
}

const ChatRoomTemplate = ({ children }: Props) => {
  return <ChatRoomTemplateStyled>{children}</ChatRoomTemplateStyled>;
};

export default ChatRoomTemplate;
