import styled from "styled-components";
import img from "../../../assets/42logo.svg";
import imageCompression from "browser-image-compression";
import React, { useState } from "react";

/**
 * 일단은 주석처리..
 */
interface Props {
  // width: string;
  // height: string;
  // src?: string;
}

// const AvatarStyled = styled.div<Props>`
//   width: ${(props) => props.width};
//   height: ${(props) => props.height};
//   background-image: url(${(props) => props.src || ""});
//   background-color: #dcdde1;
//   border-radius: 50%;
// `;

const Avatar = ({ ...rest }: Props) => {
  let button = document.createElement("input");
  const [image, setImage] = useState(img);
  /**
   * 파일이 들어왔을 경우 핸들러
   */
  const fileHandler = (event?: any) => {
    const [file] = event.target.files;
    /**
     * 이미지 크기 조절
     */
    imageCompression(file, {
      maxWidthOrHeight: 200,
    }).then((compressedFile) => {
      const newFile: any = new File([compressedFile], file.name, {
        type: file.type,
      });
      //이미지 업로드하고 이미지 url 받아서 setImage에 parameter로 넣어주면 됨.
      //현재는 임의로 component를 넣어줌. 아마 엑박 뜰거임..
      setImage(newFile);
      // setImage(img);
    });
  };
  button.setAttribute("type", "file");
  button.setAttribute("accept", "image/*");
  button.onchange = (event) => fileHandler(event);
  /**
   * 아바타 클릭시 img 업로드 버튼 클릭 event 발생
   */
  const imageButton = () => {
    button.click();
  };
  return <img src={image} width="200px" height="200px" onClick={imageButton} />;

  // return <AvatarStyled {...rest} />;
};

export default Avatar;
