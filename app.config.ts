import { ExpoConfig } from 'expo/config'

import { tokens } from "@tamagui/themes"

const config: ExpoConfig = {
  name: "Neko03",
  slug: "neko03-page",
  description: "Neko03 User Interface - web/iOS",
  scheme: "neko",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  icon: "./assets/icons/chiyoi.png",
  primaryColor: tokens.color.pink3Light.val,
  platforms: [
    'ios',
    'web',
  ],
  ios: {
    supportsTablet: true,
    icon: "./assets/icons/chiyoi.png",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/icons/chiyoi.png",
  },
  extra: {
    ENV: process.env.ENV,
  }
}

export default config

