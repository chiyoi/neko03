import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: "Neko03",
  slug: "neko03",
  description: "Nyan~",
  scheme: "neko",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  icon: "./assets/icons/chiyoi.png",
  primaryColor: "#fccae2",
  platforms: ["ios", "web"],
  ios: {
    supportsTablet: true,
    icon: "./assets/icons/chiyoi.png",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/icons/chiyoi.png",
  },
  extra: {
    "eas": {
      "projectId": "360e6d2f-5998-4090-84a5-b690edc803cf",
    },
    "isProd": process.env["ENV"] === "prod",
  },
  updates: {
    url: "https://u.expo.dev/360e6d2f-5998-4090-84a5-b690edc803cf",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
}

export default config
