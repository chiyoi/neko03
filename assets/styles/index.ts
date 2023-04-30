import { Button, GetProps, Popover, Stack } from "tamagui"

export const centralized: GetProps<typeof Stack> = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

export const styleIconButton: GetProps<typeof Button> = {
  animation: "bouncy",
  circular: true,
  color: "$color7",
  width: 45,
  height: 45,
  pressStyle: {
    scale: 0.9,
  },
}

export const styleTopLeftIconButton: GetProps<typeof Button> = {
  ...styleIconButton,
  position: "absolute",
  top: 30,
  left: 30,
}

export const styleTopRightIconButton: GetProps<typeof Button> = {
  ...styleIconButton,
  position: "absolute",
  top: 30,
  right: 30,
}

export const styleBottomIconButton: GetProps<typeof Button> = {
  ...styleIconButton,
  position: "absolute",
  bottom: 10,
  alignSelf: "center",
}


export const styleBounceDown: GetProps<typeof Popover.Content> = {
  animation: ["bouncy", {
    opacity: {
      overshootClamping: true,
    },
  }],
  enterStyle: { y: -10, opacity: 0 },
  exitStyle: { y: -10, opacity: 0 },
  x: 0,
  y: 0,
  opacity: 1,
  elevate: true,
}

export const styleBounceUp: GetProps<typeof Popover.Content> = {
  animation: ["bouncy", {
    opacity: {
      overshootClamping: true,
    },
  }],
  enterStyle: { y: 10, opacity: 0 },
  exitStyle: { y: 10, opacity: 0 },
  x: 0,
  y: 0,
  opacity: 1,
  elevate: true,
}