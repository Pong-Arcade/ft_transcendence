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

export interface ILobbyChatRoomFormValues {
  mode: string;
  title: string;
  password: string;
  maxUserCount: string;
}

export interface IChatRoomInviteForm {
  users: number[];
}

export interface IUseChatRoomForm {
  onSubmit: (values: ILobbyChatRoomFormValues) => void;
}
export interface ILobbyChatRoomErrors
  extends Partial<ILobbyChatRoomFormValues> {}

const useChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
  const [values, setValues] = useState<ILobbyChatRoomFormValues>({
    mode: EChatRoomMode.PUBLIC as string,
    title: "",
    password: "",
    maxUserCount: "",
  });
  const [errors, setErrors] = useState<ILobbyChatRoomErrors>({});

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === EChatRoomFormValues.MODE) {
      setValues({
        [name]: value,
        [EChatRoomFormValues.TITLE]: "",
        [EChatRoomFormValues.PASSWORD]: "",
        [EChatRoomFormValues.MAXUSER_COUNT]: "",
      });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = ChatRoomFormValidator({ ...values });
    setErrors(error);
    if (error && Object.keys(error).length === 0) {
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

export const MAX_PASSWORD_LENGTH = 10;
export const MAX_TITLE_LENGTH = 20;
export const MIN_USER_NUMBER = 2;
export const MAX_USER_NUMBER = 10;

const ChatRoomFormValidator = ({
  mode,
  title,
  password,
  maxUserCount,
}: ILobbyChatRoomFormValues) => {
  const errors: ILobbyChatRoomErrors = {};

  if (!(mode in EChatRoomMode)) {
    errors.mode = "???????????? ???????????? ????????????";
  }

  if (mode === EChatRoomMode.PROTECTED) {
    if (!password.length) {
      errors.password = "??????????????? ??????????????????";
    } else if (password.length > MAX_PASSWORD_LENGTH) {
      errors.password = `??????????????? ${MAX_PASSWORD_LENGTH}??? ????????? ??????????????????`;
    }
  }

  if (!title.length) {
    errors.title = "???????????? ??????????????????";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `???????????? ${MAX_TITLE_LENGTH}??? ????????? ??????????????????`;
  }

  if (!maxUserCount.length) {
    errors.maxUserCount = "??????????????? ??????????????????";
  } else if (
    MIN_USER_NUMBER > +maxUserCount ||
    +maxUserCount > MAX_USER_NUMBER
  ) {
    errors.maxUserCount = `??????????????? ${MIN_USER_NUMBER} ~ ${MAX_USER_NUMBER} ????????? ??????????????????`;
  }

  return errors;
};
export default useChatRoomForm;
