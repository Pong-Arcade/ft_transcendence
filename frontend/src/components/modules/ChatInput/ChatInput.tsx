import React, { useContext, useState } from "react";
import styled, { css } from "styled-components";
import Input from "../../atoms/Input";
import InputLabel from "../../atoms/InputLabel";
import InputWrapper from "../../atoms/InputWrapper/InputWrapper";
import { SocketContext } from "../../../utils/ChatSocket";

type InputType = "text" | "password" | "number";
interface Props {
  defaultValue?: string;
}

const LabledInputStyled = styled(Input).attrs((props) => {
  return {
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    padding: "1.5rem",
    value: props.value && props.value,
    name: props.name && props.name,
    type: props.type || "text",
    placeholder: props.placeholder && props.placeholder,
  };
})`
  width: 100%;
  height: 10%;
  ${(props) =>
    props.type === "number" &&
    css`
      text-align: center;
    `}
  &::placeholder {
    color: transparent;
  }
`;

const ChatInput = ({ defaultValue, ...rest }: Props) => {
  const [msg, setMsg] = useState<string>();
  const socket = useContext(SocketContext);
  const enterkey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !msg || msg === "" || !socket) return;

    if (msg.split(" ")[0] === "/w") {
      socket.socket.emit("whisper", {
        fromName: socket.userName,
        toName: msg.split(" ")[1],
        msg: msg.substring(msg.split(" ")[1].length + 4),
      });
    } else {
      socket.socket.emit("message", {
        roomId: 0,
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
