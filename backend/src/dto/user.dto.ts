/**
 * 유저의 기본 정보를 저장합니다.
 * email은 확장성을 위해 optional로 설정하였습니다.
 */
export class UserDto {
  userId: number;
  intraId: string;
  imgUrl: string;
  email?: string;
}
