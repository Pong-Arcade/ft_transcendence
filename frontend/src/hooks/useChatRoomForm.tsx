import React, { useState } from "react";

export enum EChatRoomFormValues {
  MODE = "mode",
  TITLE = "title",
  PASSWORD = "password",
  MAXUSER_COUNT = "maxUserCount",
}

export enum EChatRoomMode {
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
  PRIVATE = "PRIVATE",
}

export interface IChatRoomFormValues {
  mode: string;
  title: string;
  password: string;
  maxUserCount: string;
}
export interface IUseChatRoomForm {
  onSubmit: (values: IChatRoomFormValues) => void;
}
export interface IErrors extends Partial<IChatRoomFormValues> {}

const useChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
  const [values, setValues] = useState<IChatRoomFormValues>({
    mode: EChatRoomMode.PUBLIC as string,
    title: "",
    password: "",
    maxUserCount: "",
  });
  const [errors, setErrors] = useState<IErrors>({});

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === EChatRoomFormValues.MODE) {
      if (value === EChatRoomMode.PRIVATE) {
        setValues({
          [name]: value,
          [EChatRoomFormValues.TITLE]: "비밀방입니다.",
          [EChatRoomFormValues.PASSWORD]: "",
          [EChatRoomFormValues.MAXUSER_COUNT]: "",
        });
      } else {
        setValues({
          [name]: value,
          [EChatRoomFormValues.TITLE]: "",
          [EChatRoomFormValues.PASSWORD]: "",
          [EChatRoomFormValues.MAXUSER_COUNT]: "",
        });
      }
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
    setErrors({});
  };

  return {
    values,
    errors,
    onErrorModalClose,
    onChangeForm,
    onSubmitForm,
  };
};

export const MAXPASSWORD_LENGTH = 10;
export const MAXTITLE_LENGTH = 20;
export const MINUSER_NUMBER = 2;
export const MAXUSER_NUMBER = 10;

const ChatRoomFormValidator = ({
  mode,
  title,
  password,
  maxUserCount,
}: IChatRoomFormValues) => {
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

  if (mode !== EChatRoomMode.PRIVATE) {
    if (!title.length) {
      errors.title = "방제목을 입력해주세요";
    } else if (title.length > MAXTITLE_LENGTH) {
      errors.title = `방제목은 ${MAXTITLE_LENGTH}자 이내로 입력해주세요`;
    }
  }

  if (!maxUserCount.length) {
    errors.maxUserCount = "최대인원을 입력해주세요";
  } else if (MINUSER_NUMBER > +maxUserCount || +maxUserCount > MAXUSER_NUMBER) {
    errors.maxUserCount = `최대인원은 ${MINUSER_NUMBER} ~ ${MAXUSER_NUMBER} 이내로 입력해주세요`;
  }

  return errors;
};
export default useChatRoomForm;
