import ChatRoomTemplate from "../components/templates/ChatRoomTemplate";
import Title from "../components/modules/Title";
import ChatRoomUserList from "../components/modules/ChatRoomUserList";
import ChatRoomButtons from "../components/modules/ChatRoomButtons";
import ChatRoomPasswordModify from "../components/modules/ChatRoomPasswordModify";

// TODO: 리팩토링 로비로 네비게이트(게임, 챗, 스탯, 랭크)
// TODO: modify 버튼은 관리자만 보이게 설정

const ChatRoom = () => {
  return (
    <ChatRoomTemplate>
      <Title fontSize="3rem" height="10%">
        ChatTitle
      </Title>
      <ChatRoomPasswordModify />
      <ChatRoomUserList />
      <ChatRoomButtons />
    </ChatRoomTemplate>
  );
};

export default ChatRoom;
