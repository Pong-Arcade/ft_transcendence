import React, { useEffect, useState } from "react";

export interface ICreateRoomFormValues {
  roomType?: string;
  roomTitle?: string;
  roomPassword?: string;
  maxUser?: string;
}

interface IUseCreateRoomForm {
  initialValues: object;
  onSubmit: (values: ICreateRoomFormValues) => void;
  validate: (values: ICreateRoomFormValues) => object;
}

const useCreateRoomForm = ({
  initialValues,
  onSubmit,
  validate,
}: IUseCreateRoomForm) => {
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
    setErrors(validate(values));
  };

  useEffect(() => {
    if (submitting && Object.keys(errors).length === 0) {
      alert("Submit Success");
      onSubmit(values);
    } else if (submitting && Object.keys(errors).length !== 0) {
      setSubmitting(false);
      alert(
        `${errors?.roomType} ${errors?.roomTitle} ${errors?.roomPassword} ${errors?.maxUser}`
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
};

export default useCreateRoomForm;
