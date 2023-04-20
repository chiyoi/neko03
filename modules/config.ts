import Constants from "expo-constants"

export const config = {
  ClientIDAzureADApplication: "e5a68652-2fed-4508-ad85-02e7a966307f",

  EndpointService: () => Constants.manifest?.extra?.ENV === "prod" ? (
    "https://api.neko03.moe/"
  ) : (
    "http://silver.local/"
  ),
}