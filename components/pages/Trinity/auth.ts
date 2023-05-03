import AsyncStorage from "@react-native-async-storage/async-storage"
import { TokenResponse } from "expo-auth-session"
import { createContext } from "react"

const keyAccessToken = "/trinity/auth/access-token"
const keyExpiresAt = "/trinity/auth/expires-at"

export const AuthContext = createContext<TokenResponse | null>(null)

export function query(auth: TokenResponse | null) {
  if (auth !== null) {
    return `token=${auth.accessToken}`
  }
}

export async function setCache(auth: TokenResponse) {
  await AsyncStorage.setItem(keyAccessToken, auth.accessToken)
  auth.expiresIn && await AsyncStorage.setItem(keyExpiresAt, String(Number(auth.expiresIn) + Date.now() / 1000))
}

export async function getCache() {
  const accessToken = await AsyncStorage.getItem(keyAccessToken)
  const expiresAt = await AsyncStorage.getItem(keyExpiresAt)
  if (accessToken !== null && expiresAt !== null && Date.now() / 1000 < Number(expiresAt)) {
    return new TokenResponse({ accessToken })
  }
  return null
}

export async function clearCache() {
  AsyncStorage.removeItem(keyAccessToken)
  AsyncStorage.removeItem(keyExpiresAt)
}
