import { ExpoConfig } from 'expo/config'

import { tokens } from "@tamagui/themes"

const config: ExpoConfig = {
  name: "Neko03",
  slug: "neko03",
  scheme: "neko",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  icon: "./assets/icons/chiyoi.png",
  primaryColor: tokens.color.pink3Light.val,
  ios: {
    supportsTablet: true,
    icon: "./assets/icons/chiyoi.png",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/icons/chiyoi.png",
  },
  extra: {
    ServiceEndpoint: process.env.ENV === "prod" ? (
      "https://api.neko03.moe/"
    ) : (
      "http://silver.local/"
    ),
    AzureADApplicationClientID: "e5a68652-2fed-4508-ad85-02e7a966307f",
  }
}

export default config

