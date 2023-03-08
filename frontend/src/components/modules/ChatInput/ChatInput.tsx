import React, { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { SocketContext } from "../../../utils/ChatSocket";

const ChatInput = () => {
  const [msg, setMsg] = useState<string>();
  const socket = useContext(SocketContext);
  const enterkey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !msg || msg === "" || !socket) return;

    if (msg.split(" ")[0] === "/w") {
      socket.socket.emit("whisper", {
        fromId: socket.userId,
        fromName: socket.userName,
        toName: msg.split(" ")[1],
        msg: msg.substring(msg.split(" ")[1].length + 4),
      });
    } else {
      socket.socket.emit("message", {
        userId: socket.userId,
        userName: socket.userName,
        msg: socket.userName + ": " + msg,
      });
    }
    setMsg("");
  };

  return (
    <Input
      width="100%"
      height="10%"
      borderRadius
      padding="1rem"
      fontSize="1.5rem"
      onKeyPress={enterkey}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setMsg(e.target.value)
      }
      value={msg ? msg : ""}
    />
  );
};

export default ChatInput;
