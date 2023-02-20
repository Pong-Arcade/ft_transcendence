import { MouseEvent } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";

export interface IUser {
  userId: string;
  nickname: string;
  avatarUrl?: string;
  email?: string;
}

export interface IRanking {
  ranking: number;
  userInfo: IUser;
  ladderScore: number;
  winCount: number;
  loseCount: number;
  winRate: number;
}

export interface ILobbyChatRoom {
  roomId: string;
  title: string;
  mode: string;
  maxUserCount: string;
  currentCount: string;
}

export interface IChatRoom {
  roomId: number;
  mastUserId: number;
  users: IUser[];
}

export type IItem = IUser | IRanking | ILobbyChatRoom | IChatRoom;

export interface IPaginationItem {
  item: IItem;
  subList?: string[];
  onItemClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
interface Props {
  list: IItem[];
  subList?: string[];
  PaginationItem: (arg: IPaginationItem) => JSX.Element;
  width?: string;
  height?: string;
  itemGap?: string;
  backgroundColor?: string;
  blankMessage?: string;
  buttonWidth?: string;
  buttonHeight?: string;
  buttonGroupHeight?: string;
  buttonGap?: string;
  nextPageDisabled?: boolean;
  prevPageDisabled?: boolean;
  gridTemplate?: string;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onItemClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PaginationStyled = styled(Board).attrs((props) => {
  return {
    width: props.width || "100%",
    height: props.height || "100%",
    borderRadius: true,
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
  };
})``;

interface IPaginationButtonGroup {
  gap?: string;
}

const PaginationButtonGroup = styled(ButtonGroup).attrs((props) => {
  return {
    width: "100%",
    height: props.height || "20%",
    justifyContent: "center",
  };
})<IPaginationButtonGroup>`
  gap: ${(props) => props.gap && props.gap};
`;

const PaginationButton = styled(Button).attrs((props) => {
  return {
    width: props.width,
    height: props.height,
    backgroundColor: props.theme.colors.spiroDiscoBall,
    fontSize: props.fontSize || "1rem",
    boxShadow: true,
    disabled: props.disabled && props.disabled,
  };
})`
  font-weight: 900;
`;

interface IPage {
  itemGap?: string;
  gridTemplate?: string;
}
const Page = styled.div<IPage>`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template: ${(props) => props.gridTemplate && props.gridTemplate};
  gap: ${(props) => props.itemGap && props.itemGap};
`;

const Pagination = ({
  list,
  subList,
  PaginationItem,
  itemGap,
  // blankMessage,
  buttonHeight,
  buttonWidth,
  buttonGroupHeight,
  buttonGap,
  nextPageDisabled,
  prevPageDisabled,
  gridTemplate,
  onNextPage,
  onPrevPage,
  onItemClick,
  ...rest
}: Props) => {
  return (
    <PaginationStyled {...rest}>
      <Page itemGap={itemGap} gridTemplate={gridTemplate}>
        {list.map((item, idx) => (
          <PaginationItem
            onItemClick={onItemClick}
            item={item}
            key={idx}
            subList={subList}
          />
        ))}
      </Page>
      <PaginationButtonGroup height={buttonGroupHeight} gap={buttonGap}>
        <PaginationButton
          onClick={onPrevPage}
          height={buttonHeight}
          width={buttonWidth}
          disabled={prevPageDisabled}
        >
          〈
        </PaginationButton>
        <PaginationButton
          onClick={onNextPage}
          height={buttonHeight}
          width={buttonWidth}
          disabled={nextPageDisabled}
        >
          〉
        </PaginationButton>
      </PaginationButtonGroup>
    </PaginationStyled>
  );
};

export default Pagination;
