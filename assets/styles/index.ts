import { Button, GetProps, Popover, Stack } from "tamagui"

export const centralized: GetProps<typeof Stack> = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

export const iconButton: GetProps<typeof Button> = {
  animation: "bouncy",
  circular: true,
  color: "$color7",
  pressStyle: {
    scale: 0.9,
  },
}

export const topLeftIconButton: GetProps<typeof Button> = {
  ...iconButton,
  position: "absolute",
  top: 30,
  left: 30,
  chromeless: true,
}

export const topRightIconButton: GetProps<typeof Button> = {
  ...iconButton,
  position: "absolute",
  top: 30,
  right: 30,
  chromeless: true,
}

export const bottomIconButton: GetProps<typeof Button> = {
  ...iconButton,
  position: "absolute",
  bottom: 10,
  alignSelf: "center",
  chromeless: true,
}


export const stylePopover: GetProps<typeof Popover.Content> = {
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

export const stylePopoverInverted: GetProps<typeof Popover.Content> = {
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