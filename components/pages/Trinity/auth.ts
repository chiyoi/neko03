import { config } from ".modules/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TokenResponse, refreshAsync } from "expo-auth-session"
import { createContext } from "react"

const clientId = config.ClientIDAzureAD
const tokenEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

const keyAccessToken = "/trinity/auth/access-token"
const keyExpiresAt = "/trinity/auth/expires-at"
const keyRefreshToken = "/trinity/auth/refresh-token"

export const AuthContext = createContext<TokenResponse | null>(null)

export function query(auth: TokenResponse | null) {
  if (auth !== null) {
    return `token=${auth.accessToken}`
  }
}

export async function setCache(auth: TokenResponse) {
  await AsyncStorage.setItem(keyAccessToken, auth.accessToken)
  auth.expiresIn && await AsyncStorage.setItem(keyExpiresAt, String(Number(auth.expiresIn) + Date.now() / 1000))
  auth.refreshToken && await AsyncStorage.setItem(keyRefreshToken, auth.refreshToken)
}

export async function getCache() {
  const accessToken = await AsyncStorage.getItem(keyAccessToken)
  const expiresAt = await AsyncStorage.getItem(keyExpiresAt)
  const refreshToken = await AsyncStorage.getItem(keyRefreshToken)
  if (accessToken !== null && expiresAt !== null && Date.now() / 1000 < Number(expiresAt)) {
    return new TokenResponse({ accessToken })
  }
  if (accessToken !== null && refreshToken !== null) {
    try {
      const auth = await refreshAsync({ clientId, refreshToken }, { tokenEndpoint })
      setCache(auth)
      return auth
    } catch (err) {
      console.warn(err)
    }
  }
  return null
}

export async function clearCache() {
  AsyncStorage.removeItem(keyAccessToken)
  AsyncStorage.removeItem(keyExpiresAt)
  AsyncStorage.removeItem(keyRefreshToken)
}
