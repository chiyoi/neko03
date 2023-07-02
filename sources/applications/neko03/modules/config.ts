import Constants from "expo-constants"

export const config = {
  ClientIDAzureAD: "e5a68652-2fed-4508-ad85-02e7a966307f",

  ServiceEndpoint: {
    nacho: isProd() ? "TODO: nacho container address" : "http://silver.local:7147/",
  },
}

function isProd() {
  return !!Constants.manifest?.extra?.["isProd"]
}
