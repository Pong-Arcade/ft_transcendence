import React from 'react'
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    font: {
      gunmetal: string,
      cultured: string,
      white: string,
    },
    border: {
      board: string,
    },
    background: {
      front: string,
      middle: string,
      back: string,
    },
    colors: {
      gunmetal: string,
      chineseWhite: string,
      vividCerulean: string,
      freshAir: string,
      blueCola: string,
      white: string,
      darkGunmetal: string,
      spiroDiscoBall: string,
    }
  }
}
