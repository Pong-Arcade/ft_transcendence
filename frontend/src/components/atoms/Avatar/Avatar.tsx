import styled from "styled-components";
import imageCompression from "browser-image-compression";
import React from "react";

// TODO: 본인 것만 업로드 할 수 있도록 처리
interface Props {
  width: string;
  height: string;
  src: string;
  upload?: boolean;
}

const AvatarStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 2.5px solid ${(props) => props.theme.background.front};
`;

interface AvatarLabelProps {
  src: string;
}

const AvatarLabel = styled.label<AvatarLabelProps>`
  cursor: pointer;
  height: 15vw;
  width: 15vw;
  border-radius: 50%;
  transition: 0.5s;
  box-shadow: ${(props) => props.theme.box.shadow};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;

  border: 2.5px solid ${(props) => props.theme.background.front};

  &:hover {
    box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
  }
`;

const Avatar = ({ upload, src, ...rest }: Props) => {
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

  if (upload) {
    return (
      <>
        <AvatarLabel htmlFor="avatar" src={src} />
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
  return <AvatarStyled src={src} {...rest} />;
};

export default Avatar;
