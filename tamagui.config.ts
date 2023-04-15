import { createAnimations } from "@tamagui/animations-react-native"
import { createInterFont } from "@tamagui/font-inter"
import { createMedia } from "@tamagui/react-native-media-driver"
import { themes, tokens } from "@tamagui/themes"
import { createFont, createTamagui } from "tamagui"

const animations = createAnimations({
  bouncy: {
    type: "spring",
    speed: 24,
    bounciness: 16,
  },
  move: {
    type: "timing",
  }
})

const interFont = createInterFont()

const hachiMaruPopFont = createFont((() => {
  const size = {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    true: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  } as const

  return {
    family: "HachiMaruPop_400Regular",
    size,
    lineHeight: size,
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 0,
    },
  }
})())

const media = createMedia({
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: "none" },
  pointerCoarse: { pointer: "coarse" },
})

export default createTamagui({
  animations,
  defaultTheme: "light",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  fonts: {
    heading: interFont,
    body: interFont,
    neko: hachiMaruPopFont,
  },
  themes,
  tokens,
  media,
});

