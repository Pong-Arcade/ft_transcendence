import ChatRoomTemplate from "../components/templates/ChatRoomTemplate";
import Title from "../components/modules/Title";
import ChatRoomUserList from "../components/modules/ChatRoomUserList";
import ChatRoomButtons from "../components/modules/ChatRoomButtons";

const ChatRoom = () => {
  return (
    <>
      <ChatRoomTemplate>
        <Title fontSize="3rem" height="10%">
          ChatTitle
        </Title>
        <ChatRoomUserList />
        <ChatRoomButtons />
      </ChatRoomTemplate>
    </>
  );
};

export default ChatRoom;
