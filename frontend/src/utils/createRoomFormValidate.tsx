import { ICreateRoomFormValues } from "../hooks/useCreateRoomForm";
import { ECheckedType } from "../components/modules/ModalContent/ModalContent";

const createRoomFormValidate = ({
  roomType,
  roomTitle,
  roomPassword,
  maxUser,
}: ICreateRoomFormValues) => {
  const errors: ICreateRoomFormValues = {};

  if (!roomType || roomType === "undefined") {
    errors.roomType = "방유형을 선택해주세요";
  } else if (!(roomType in ECheckedType)) {
    errors.roomType = "방유형이 옳바르지 않습니다";
  }

  if (!roomTitle || roomTitle.length === 0) {
    errors.roomTitle = "방제목을 입력해주세요";
  } else if (roomTitle.length > 20) {
    errors.roomTitle = "방제목은 20자 이내로 입력해주세요";
  }

  if (roomType === ECheckedType.Protected) {
    if (!roomPassword || roomPassword.length === 0) {
      errors.roomPassword = "비밀번호를 입력해주세요";
    } else if (roomPassword.length > 10) {
      errors.roomPassword = "비밀번호는 10자 이내로 입력해주세요";
    }
  }

  if (!maxUser || maxUser.length === 0) {
    errors.maxUser = "최대인원을 입력해주세요";
  } else if (+maxUser > 10) {
    errors.maxUser = "최대인원은 10명 이내로 입력해주세요";
  }

  return errors;
};

export default createRoomFormValidate;
