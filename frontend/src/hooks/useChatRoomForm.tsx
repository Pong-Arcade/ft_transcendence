import React, { useEffect, useState } from "react";

export enum EChatRoomFormValues {
  TYPE = "Type",
  TITLE = "Title",
  PASSWORD = "Password",
  MAXUSER = "MaxUser",
}

export enum EChatRoomType {
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
  PRIVATE = "PRIVATE",
}

export interface IChatRoomFormValues {
  Type: string;
  Title: string;
  Password: string;
  MaxUser: string;
}
export interface IUseChatRoomForm {
  onSubmit: (values: IChatRoomFormValues) => void;
}
export interface IErrors extends Partial<IChatRoomFormValues> {}

const useChatRoomForm = ({ onSubmit }: IUseChatRoomForm) => {
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
      if (value === EChatRoomType.PRIVATE) {
        setValues({
          [name]: value,
          [EChatRoomFormValues.TITLE]: "비밀방입니다.",
          [EChatRoomFormValues.PASSWORD]: "",
          [EChatRoomFormValues.MAXUSER]: "",
        });
      } else {
        setValues({
          [name]: value,
          [EChatRoomFormValues.TITLE]: "",
          [EChatRoomFormValues.PASSWORD]: "",
          [EChatRoomFormValues.MAXUSER]: "",
        });
      }
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

export const MAXPASSWORD_LENGTH = 10;
export const MAXTITLE_LENGTH = 20;
export const MINUSER_NUMBER = 2;
export const MAXUSER_NUMBER = 10;

const ChatRoomFormValidator = ({
  Type,
  Title,
  Password,
  MaxUser,
}: IChatRoomFormValues) => {
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

  if (Type !== EChatRoomType.PRIVATE) {
    if (!Title.length) {
      errors.Title = "방제목을 입력해주세요";
    } else if (Title.length > MAXTITLE_LENGTH) {
      errors.Title = `방제목은 ${MAXTITLE_LENGTH}자 이내로 입력해주세요`;
    }
  }

  if (!MaxUser.length) {
    errors.MaxUser = "최대인원을 입력해주세요";
  } else if (MINUSER_NUMBER > +MaxUser || +MaxUser > MAXUSER_NUMBER) {
    errors.MaxUser = `최대인원은 ${MINUSER_NUMBER} ~ ${MAXUSER_NUMBER} 이내로 입력해주세요`;
  }

  return errors;
};
export default useChatRoomForm;
