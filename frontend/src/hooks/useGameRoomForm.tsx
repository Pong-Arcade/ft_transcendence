import React, { useState } from "react";
import {
  MAXTITLE_LENGTH,
  MAXUSER_NUMBER,
  MINUSER_NUMBER,
} from "./useChatRoomForm";

export enum EGameRoomFormValues {
  TITLE = "title",
  MAXUSER = "maxUserCount",
}

export interface IGameRoomFormValues {
  title: string;
  maxUserCount: string;
}

interface IUseGameRoomForm {
  onSubmit: (values: IGameRoomFormValues) => void;
}
export interface IErrors extends Partial<IGameRoomFormValues> {}

function useGameRoomForm({ onSubmit }: IUseGameRoomForm) {
  const [values, setValues] = useState({
    title: "",
    maxUserCount: "",
  });
  const [errors, setErrors] = useState<IErrors>({});

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
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
}

const ChatRoomFormValidator = ({
  title,
  maxUserCount,
}: IGameRoomFormValues) => {
  const errors: IErrors = {};

  if (!title.length) {
    errors.title = "방제목을 입력해주세요";
  } else if (title.length > MAXTITLE_LENGTH) {
    errors.title = `방제목은 ${MAXTITLE_LENGTH}자 이내로 입력해주세요`;
  }

  if (!maxUserCount.length) {
    errors.maxUserCount = "최대인원을 입력해주세요";
  } else if (MINUSER_NUMBER > +maxUserCount || +maxUserCount > MAXUSER_NUMBER) {
    errors.maxUserCount = `최대인원은 ${MINUSER_NUMBER} ~ ${MAXUSER_NUMBER} 이내로 입력해주세요`;
  }

  return errors;
};
export default useGameRoomForm;
