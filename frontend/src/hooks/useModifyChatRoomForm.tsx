import React, { useState } from "react";
import {
  EChatRoomFormValues,
  EChatRoomMode,
  ILobbyChatRoomFormValues,
  ILobbyChatRoomErrors,
  IUseChatRoomForm,
  MAX_PASSWORD_LENGTH,
  MAX_TITLE_LENGTH,
} from "./useChatRoomForm";

const useModifyChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
  const [values, setValues] = useState({
    mode: EChatRoomMode.PUBLIC as string,
    title: "",
    password: "",
    maxUserCount: "",
  });

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === EChatRoomFormValues.MODE) {
      setValues({
        ...values,
        [name]: value,
        [EChatRoomFormValues.PASSWORD]: "",
      });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = ChatRoomFormValidator({ ...values });
    if (errors && Object.keys(errors).length === 0) {
      onSubmit(values);
    }
  };

  return {
    values,
    onChangeForm,
    onSubmitForm,
  };
};

const ChatRoomFormValidator = ({
  mode,
  title,
  password,
}: ILobbyChatRoomFormValues) => {
  const errors: ILobbyChatRoomErrors = {};

  if (!(mode in EChatRoomMode)) {
    errors.mode = "방유형이 옳바르지 않습니다";
  }

  if (!title.length) {
    errors.title = "방제목을 입력해주세요";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `방제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요`;
  }

  if (mode === EChatRoomMode.PROTECTED) {
    if (!password.length) {
      errors.password = "비밀번호를 입력해주세요";
    } else if (password.length > MAX_PASSWORD_LENGTH) {
      errors.password = `비밀번호는 ${MAX_PASSWORD_LENGTH}자 이내로 입력해주세요`;
    }
  }

  return errors;
};
export default useModifyChatRoomForm;
