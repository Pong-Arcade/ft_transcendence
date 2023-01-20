import img from "../../../assets/42logo.svg";
import imageCompression from "browser-image-compression";
import React, { useState } from "react";

const Avatar = () => {
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
      //현재는 임의의 이미지 url을 넣어줌.
      setImage(
        "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcnSjVy%2FbtryxIykp2U%2Fx3gxle1xtswxAkViKJ2tcK%2Fimg.png"
      );
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
};

export default Avatar;
