import React from "react";
import styled from "styled-components";

interface Props {
  width: string;
  height: string;
  src?: string;
}

const AvatarStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-image: url(${(props) => props.src || ""});
  background-color: #dcdde1;
  border-radius: 50%;
`;

const Avatar = ({ ...rest }: Props) => {
  return <AvatarStyled {...rest} />;
};

export default Avatar;
