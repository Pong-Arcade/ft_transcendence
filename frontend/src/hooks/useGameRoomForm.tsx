import React, { useState } from "react";
import { MAX_TITLE_LENGTH } from "./useChatRoomForm";

export enum EGameRoomFormValues {
  MODE = "mode",
  TITLE = "title",
  WINSCORE = "winScore",
  MAX_SPECTATOR_COUNT = "maxSpectatorCount",
}

export enum EGameType {
  NORMAL = "NORMAL",
  LADDER = "LADDER",
}

export enum EGameRoomMode {
  NORMAL = "NORMAL",
  POWER_UP = "POWER_UP",
}
export interface IGameRoomFormValues {
  mode: string | EGameRoomMode;
  title: string;
  winScore: string;
  maxSpectatorCount: string;
}

interface IUseGameRoomForm {
  onSubmit: (values: IGameRoomFormValues) => void;
}
export interface IGameRoomErrors extends Partial<IGameRoomFormValues> {}

function useGameRoomForm({ onSubmit }: IUseGameRoomForm) {
  const [values, setValues] = useState({
    mode: EGameRoomMode.NORMAL as string,
    title: "",
    winScore: "",
    maxSpectatorCount: "",
  });
  const [errors, setErrors] = useState<IGameRoomErrors>({});

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = GameRoomFormValidator({ ...values });
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
}

const MIN_WINSCORE_NUMBER = 1;
const MAX_WINSCORE_NUMBER = 10;
const MAX_USER_NUMBER = 5;

const GameRoomFormValidator = ({
  mode,
  title,
  winScore,
  maxSpectatorCount,
}: IGameRoomFormValues) => {
  const errors: IGameRoomErrors = {};

  if (!(mode in EGameRoomMode)) {
    errors.mode = "방유형이 옳바르지 않습니다";
  }

  if (!title.length) {
    errors.title = "방제목을 입력해주세요";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `방제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요`;
  }

  if (!winScore.length) {
    errors.winScore = "승리점수를 입력해주세요";
  } else if (
    MIN_WINSCORE_NUMBER > +winScore ||
    +winScore > MAX_WINSCORE_NUMBER
  ) {
    errors.winScore = `승리점수는  ${MIN_WINSCORE_NUMBER} ~ ${MAX_WINSCORE_NUMBER} 이내로 입력해주세요`;
  }

  if (!maxSpectatorCount.length) {
    errors.maxSpectatorCount = "최대인원을 입력해주세요";
  } else if (0 > +maxSpectatorCount || +maxSpectatorCount > MAX_USER_NUMBER) {
    errors.maxSpectatorCount = `최대인원은 0 ~ ${MAX_USER_NUMBER} 이내로 입력해주세요`;
  }

  return errors;
};
export default useGameRoomForm;
