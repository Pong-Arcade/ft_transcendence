import ChatRoomTemplate from "../components/templates/ChatRoomTemplate";
import Title from "../components/modules/Title";
import ChatRoomUserList from "../components/modules/ChatRoomUserList";
import ChatRoomButtonGroup from "../components/modules/ChatRoomButtonGroup";
import ChatRoomPasswordModify from "../components/modules/ChatRoomPasswordModify";

// TODO: modify 버튼은 관리자만 보이게 설정

const ChatRoom = () => {
  return (
    <ChatRoomTemplate>
      <Title fontSize="3rem" height="10%">
        ChatTitle
      </Title>
      <ChatRoomPasswordModify />
      <ChatRoomUserList />
      <ChatRoomButtonGroup />
    </ChatRoomTemplate>
  );
};

export default ChatRoom;
