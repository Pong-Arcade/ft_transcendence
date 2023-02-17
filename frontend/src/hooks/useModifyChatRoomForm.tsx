import React, { useState } from "react";
import {
  EChatRoomFormValues,
  EChatRoomMode,
  IChatRoomFormValues,
  IErrors,
  IUseChatRoomForm,
  MAXPASSWORD_LENGTH,
} from "./useChatRoomForm";

// TODO: 기존값 받아오기
const useModifyChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
  const [values, setValues] = useState({
    mode: EChatRoomMode.PUBLIC as string,
    title: "",
    password: "",
    maxUserCount: "",
  });
  const [errors, setErrors] = useState<IErrors>();

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

const ChatRoomFormValidator = ({ mode, password }: IChatRoomFormValues) => {
  const errors: IErrors = {};

  if (!(mode in EChatRoomMode)) {
    errors.mode = "방유형이 옳바르지 않습니다";
  }

  if (mode === EChatRoomMode.PROTECTED) {
    if (!password.length) {
      errors.password = "비밀번호를 입력해주세요";
    } else if (password.length > MAXPASSWORD_LENGTH) {
      errors.password = `비밀번호는 ${MAXPASSWORD_LENGTH}자 이내로 입력해주세요`;
    }
  }

  return errors;
};
export default useModifyChatRoomForm;
