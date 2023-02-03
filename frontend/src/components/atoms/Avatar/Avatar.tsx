import styled from "styled-components";
import imageCompression from "browser-image-compression";
import React, { useState } from "react";
import Logo from "../../../assets/42logo.svg";

// TODO: 본인 것만 업로드 할 수 있도록 처리
interface Props {
  width: string;
  height: string;
  src?: string;
  upload?: boolean;
}

const AvatarStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-image: url(${(props) => props.src || ""});
  background-color: #dcdde1;
  border-radius: 50%;
`;

const AvatarLabel = styled.label`
  cursor: pointer;
  background-color: white;
  height: 15vw;
  width: 15vw;
  border-radius: 50%;
  transition: 0.5s;
  background-position: center;
  background-repeat: no-repeat;

  &:hover {
    box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
  }
`;

const Avatar = ({ upload, ...rest }: Props) => {
  //TODO: Logo를 처음 받아오는 이미지로 수정
  const [image, setImage] = useState(Logo);

  const uploadToServer = (file: File) => {
    console.log(file);
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLInputElement>) => {
    const imageFile = (e.target as HTMLInputElement).files?.[0];
    if (!imageFile) return;

    const options = {
      maxWidthOrHeight: 200,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      await uploadToServer(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(image);
  if (upload) {
    return (
      <>
        <AvatarLabel
          htmlFor="avatar"
          style={{ backgroundImage: `url(${image})` }}
        />
        <input
          type="file"
          id="avatar"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
      </>
    );
  }
  return <AvatarStyled {...rest} />;
};

export default Avatar;
