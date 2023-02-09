import React, { useEffect, useState } from "react";

export interface ICreateRoomFormValues {
  Type?: string;
  Title?: string;
  Password?: string;
  maxUser?: string;
}

export interface ICreateRoomFormValidate extends ICreateRoomFormValues {
  roomType: string;
}

export enum ECreateRoomFormValidate {
  CHAT = "Chat",
  GAME = "Game",
}

export enum ECreateRoomFormValues {
  TYPE = "Type",
  TITLE = "Title",
  PASSWORD = "Password",
  MAXUSER = "maxUser",
}

interface IUseCreateRoomForm {
  initialValues: ICreateRoomFormValues;
  onSubmit: (values: ICreateRoomFormValues) => void;
  validate: (values: ICreateRoomFormValidate) => object;
  roomType: string;
}

// TODO: 리팩토링
function useCreateRoomForm({
  initialValues,
  onSubmit,
  validate,
  roomType,
}: IUseCreateRoomForm) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ICreateRoomFormValues>({});
  const [submitting, setSubmitting] = useState(false);

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors(validate({ ...values, ["roomType"]: roomType }));
  };

  useEffect(() => {
    if (submitting && Object.keys(errors).length === 0) {
      alert("Submit Success");
      onSubmit(values);
    } else if (submitting && Object.keys(errors).length !== 0) {
      setSubmitting(false);
      alert(
        `${errors?.Type} ${errors?.Title} ${errors?.Password} ${errors?.maxUser}`
      );
    }
  }, [errors]);

  return {
    values,
    errors,
    submitting,
    onChangeForm,
    onSubmitForm,
  };
}

export default useCreateRoomForm;
