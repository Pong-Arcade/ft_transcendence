import React, { useEffect, useState } from "react";
import {
  EChatRoomFormValues,
  EChatRoomType,
  IChatRoomFormValues,
  IErrors,
  IUseChatRoomForm,
  MAXPASSWORD_LENGTH,
} from "./useChatRoomForm";

// TODO: 기존값 받아오기
const useModifyChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
  const [values, setValues] = useState({
    Type: EChatRoomType.PUBLIC as string,
    Title: "",
    Password: "",
    MaxUser: "",
  });
  const [errors, setErrors] = useState<IErrors>();

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === EChatRoomFormValues.TYPE) {
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
  };

  // TODO: 채팅방 생성 요청 보내기
  useEffect(() => {
    if (errors && Object.keys(errors).length === 0) {
      onSubmit(values);
    }
  }, [errors]);

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

const ChatRoomFormValidator = ({ Type, Password }: IChatRoomFormValues) => {
  const errors: IErrors = {};

  if (!(Type in EChatRoomType)) {
    errors.Type = "방유형이 옳바르지 않습니다";
  }

  if (Type === EChatRoomType.PROTECTED) {
    if (!Password.length) {
      errors.Password = "비밀번호를 입력해주세요";
    } else if (Password.length > MAXPASSWORD_LENGTH) {
      errors.Password = `비밀번호는 ${MAXPASSWORD_LENGTH}자 이내로 입력해주세요`;
    }
  }

  return errors;
};
export default useModifyChatRoomForm;
