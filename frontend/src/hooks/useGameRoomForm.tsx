import React, { useEffect, useState } from "react";
import {
  MAXTITLE_LENGTH,
  MAXUSER_NUMBER,
  MINUSER_NUMBER,
} from "./useChatRoomForm";

export enum EGameRoomFormValues {
  TITLE = "Title",
  MAXUSER = "MaxUser",
}

export interface IGameRoomFormValues {
  Title: string;
  MaxUser: string;
}

interface IUseGameRoomForm {
  onSubmit: (values: IGameRoomFormValues) => void;
}
export interface IErrors extends Partial<IGameRoomFormValues> {}

function useGameRoomForm({ onSubmit }: IUseGameRoomForm) {
  const [values, setValues] = useState({
    Title: "",
    MaxUser: "",
  });
  const [errors, setErrors] = useState<IErrors>();

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
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
}

const ChatRoomFormValidator = ({ Title, MaxUser }: IGameRoomFormValues) => {
  const errors: IErrors = {};

  if (!Title.length) {
    errors.Title = "방제목을 입력해주세요";
  } else if (Title.length > MAXTITLE_LENGTH) {
    errors.Title = `방제목은 ${MAXTITLE_LENGTH}자 이내로 입력해주세요`;
  }

  if (!MaxUser.length) {
    errors.MaxUser = "최대인원을 입력해주세요";
  } else if (MINUSER_NUMBER > +MaxUser || +MaxUser > MAXUSER_NUMBER) {
    errors.MaxUser = `최대인원은 ${MINUSER_NUMBER} ~ ${MAXUSER_NUMBER} 이내로 입력해주세요`;
  }

  return errors;
};
export default useGameRoomForm;
