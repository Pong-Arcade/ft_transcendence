import styled from "styled-components";
import Board from "../../atoms/Board";
import AttributeGroup from "../AttributeGroup";
import { IUser } from "../Pagination/Pagination";

export interface IStat {
  matchId: number;
  matchResult: string;
  opponent: IUser;
  myScore: number;
  opponentScore: number;
  beginDate: string;
  matchTime: number;
  matchType: string;
}

const StatListStyled = styled(Board).attrs({
  width: "100%",
  height: "89%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const GridWrapper = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})`
  display: grid;
  grid-template: repeat(10, 1fr) / 1fr;
`;

const FieldWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 100%;
`;

const Field = styled.div<{ win?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1.7rem;
  color: ${(props) => (props.win ? "#05f87f" : "#f7f300")};
`;
const TimeField = styled.div`
  display: grid;
  grid-template: repeat(2, 1fr) / 1fr;
`;
interface Props {
  list: IStat[];
}
// TODO: 최근 전적 없을 시 나오는 화면 추가
const StatList = ({ list }: Props) => {
  const attrList = ["결과", "상대ID", "분류", "점수", "플레이시간", "시작시간"];
  return (
    <StatListStyled>
      <AttributeGroup attrList={attrList} />
      <GridWrapper>
        {list.map(
          ({
            matchId,
            matchResult,
            opponent: { nickname },
            matchType,
            myScore,
            opponentScore,
            matchTime,
            beginDate,
          }) => (
            <FieldWrapper key={matchId}>
              <Field win={matchResult === "WIN"}>{matchResult}</Field>
              <Field win={matchResult === "WIN"}>{nickname}</Field>
              <Field win={matchResult === "WIN"}>{matchType}</Field>
              <Field win={matchResult === "WIN"}>
                {myScore} : {opponentScore}
              </Field>
              <Field win={matchResult === "WIN"}>
                {Math.floor(matchTime / 1000 / 60)}분 {(matchTime / 1000) % 60}
                초
              </Field>
              <TimeField>
                <Field win={matchResult === "WIN"}>
                  {beginDate.split("T")[0]}
                </Field>
                <Field win={matchResult === "WIN"}>
                  {beginDate.split("T")[1].split(".")[0]}
                </Field>
              </TimeField>
            </FieldWrapper>
          )
        )}
      </GridWrapper>
    </StatListStyled>
  );
};

export default StatList;
