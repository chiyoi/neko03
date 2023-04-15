import Constants from "expo-constants"

const serviceEndpoint = Constants.manifest?.extra?.ServiceEndpoint

export const downloadEndpoint = new URL("/trinity/download/", serviceEndpoint).href
