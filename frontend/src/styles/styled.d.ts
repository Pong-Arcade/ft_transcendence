import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    font: {
      gunmetal: string;
      cultured: string;
      white: string;
    };
    border: {
      board: string;
    };
    box: {
      shadow: string;
    };
    background: {
      front: string;
      middle: string;
      back: string;
    };
    template: {
      width: string;
      height: string;
    };
    colors: {
      gunmetal: string;
      chineseWhite: string;
      vividCerulean: string;
      freshAir: string;
      blueCola: string;
      white: string;
      darkGunmetal: string;
      spiroDiscoBall: string;
    };
  }
}
