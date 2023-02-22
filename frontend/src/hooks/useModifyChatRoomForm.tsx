import React, { useState } from "react";
import {
  EChatRoomFormValues,
  EChatRoomMode,
  ILobbyChatRoomFormValues,
  ILobbyChatRoomErrors,
  IUseChatRoomForm,
  MAX_PASSWORD_LENGTH,
} from "./useChatRoomForm";

// TODO: 기존값 받아오기
const useModifyChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
  const [values, setValues] = useState({
    mode: EChatRoomMode.PUBLIC as string,
    title: "",
    password: "",
    maxUserCount: "",
  });
  const [errors, setErrors] = useState<ILobbyChatRoomErrors>();

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
    setErrors(ChatRoomFormValidator({ ...values }));
    if (errors && Object.keys(errors).length === 0) {
      onSubmit(values);
    }
  };

  const onErrorModalClose = () => {
    setErrors(undefined);
  };

  return {
    values,
    errors,
    onErrorModalClose,
    onChangeForm,
    onSubmitForm,
  };
};

const ChatRoomFormValidator = ({
  mode,
  password,
}: ILobbyChatRoomFormValues) => {
  const errors: ILobbyChatRoomErrors = {};

  if (!(mode in EChatRoomMode)) {
    errors.mode = "방유형이 옳바르지 않습니다";
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
