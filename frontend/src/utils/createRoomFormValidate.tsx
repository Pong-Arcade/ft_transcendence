import { EChatRoomType } from "../components/modules/RoomTypeCheckBoxGroup/RoomTypeCheckBoxGroup";
import {
  ECreateRoomFormValidate,
  ICreateRoomFormValidate,
  ICreateRoomFormValues,
} from "../hooks/useCreateRoomForm";

// FIXME: 리팩토링
const createRoomFormValidate = ({
  Type,
  Title,
  Password,
  maxUser,
  roomType,
}: ICreateRoomFormValidate) => {
  const errors: ICreateRoomFormValues = {};

  if (roomType === ECreateRoomFormValidate.CHAT) {
    if (!Type || Type === "undefined") {
      errors.Type = "방유형을 선택해주세요";
    } else if (!(Type in EChatRoomType)) {
      console.log(Type in EChatRoomType);
      console.log(Type);
      console.log(EChatRoomType);

      errors.Type = "방유형이 옳바르지 않습니다";
    }

    if (Type === EChatRoomType.PROTECTED) {
      if (!Password || Password.length === 0) {
        errors.Password = "비밀번호를 입력해주세요";
      } else if (Password.length > 10) {
        errors.Password = "비밀번호는 10자 이내로 입력해주세요";
      }
    }
  }

  if (Type !== EChatRoomType.PRIVATE) {
    if (!Title || Title.length === 0) {
      errors.Title = "방제목을 입력해주세요";
    } else if (Title.length > 20) {
      errors.Title = "방제목은 20자 이내로 입력해주세요";
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
