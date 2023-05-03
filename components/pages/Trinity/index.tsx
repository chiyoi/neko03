import axios from "axios"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { KeyboardAvoidingView } from "react-native"
import { TokenResponse } from "expo-auth-session"
import { maybeCompleteAuthSession } from "expo-web-browser"

import MessageList from ".components/pages/Trinity/MessageList"
import CenterSquare from ".components/CenterSquare"
import Login from ".components/pages/Trinity/Login"
import BackButton from ".components/BackButton"
import ErrorDialog from ".components/ErrorDialog"
import Me from ".components/pages/Trinity/Me"
import { AuthContext, getCache } from ".components/pages/Trinity/auth"
import Messaging from ".components/pages/Trinity/Messaging"
import { config } from ".modules/config"
import { errorMessage } from ".modules/axios_utils"
import { ToastContext } from ".modules/toast"

const endpointSync = new URL("/trinity/sync", config.EndpointService).href

export default function Trinity() {
  const toast = useContext(ToastContext)

  const [auth, setAuth] = useState<TokenResponse | null>(null)
  const [gettingAuthCache, setGettingAuthCache] = useState(true)
  const [syncState, setSyncState] = useState<boolean | string>(false)

  const getAuthCache = useCallback(() => {
    if (gettingAuthCache) {
      if (auth === null) {
        getCache().then(auth => {
          if (auth !== null) {
            setAuth(auth)
          }
        })
      }
      setGettingAuthCache(false)
    }
  }, [auth, gettingAuthCache])

  const sync = useCallback(async () => {
    if (auth !== null) {
      console.log("syncing")
      toast("Logging in~")
      axios.post<{ passed: boolean, message?: string }>(endpointSync, JSON.stringify({ access_token: auth.accessToken })).then(resp => {
        if (resp.data.passed) {
          console.log("sync result: passed")
          toast("Logged in~")
          setSyncState(true)
        } else {
          console.log(`sync result: failed (${resp.data.message})`)
          toast("Login failed~")
          setSyncState(resp.data.message || "")
        }
      }).catch(err => {
        const message = "Unknown error~"
        console.warn(err)
        toast(message)
        setSyncState(message)
      })
    }
  }, [auth])

  useEffect(() => { getAuthCache() }, [getAuthCache])
  useEffect(() => { sync() }, [sync])

  maybeCompleteAuthSession()

  if (gettingAuthCache) {
    return null
  }

  if (auth === null) {
    return <Login />
  }

  if (syncState === false) {
    return <CenterSquare title="Logging in~" />
  }

  if (syncState !== true) {
    return <ErrorDialog message={syncState} />
  }

  return (
    <AuthContext.Provider value={auth}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}>
        <MessageList />

        <Messaging />

        <Me />

        <BackButton />
      </KeyboardAvoidingView>
    </AuthContext.Provider>
  )
}
