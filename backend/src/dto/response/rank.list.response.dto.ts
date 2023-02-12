import { RankDto } from '../rank.dto';

/**
 * 순위 정보를 반환하는 dto입니다.
 * ranklist는 순위 정보 리스트를 저장합니다.
 * isLast는 마지막 페이지인지 여부를 저장합니다.
 */
export class RankListResponseDto {
  rankList: RankDto[]; // 순위 정보 리스트
  isLast: boolean; // 마지막 페이지인지 여부
}
