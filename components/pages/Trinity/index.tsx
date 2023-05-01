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

  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState<TokenResponse | null>(null)
  const [syncState, setSyncState] = useState<boolean | string>(false)

  const getAuthCache = useCallback(async () => {
    if (auth === null) {
      console.log("getting auth cache")
      const auth = await getCache()
      if (auth !== null) {
        console.log("got auth cache")
        setAuth(auth)
      }
    }
    setLoading(false)
  }, [auth])

  const sync = useCallback(async () => {
    if (auth !== null) {
      console.log("syncing")

      type ResponseSync = {
        passed: boolean,
        message?: string,
      }
      axios.post<ResponseSync>(endpointSync, JSON.stringify({ access_token: auth.accessToken })).then(resp => {
        if (resp.data.passed) {
          console.log("sync result: passed")
          toast("Successfully login~")
          setSyncState(true)
        } else {
          console.log(`sync result: failed (${resp.data.message})`)
          setSyncState(resp.data.message || "")
        }
      }).catch(err => {
        console.warn(err)
        setSyncState(errorMessage(err))
      })
    }
  }, [auth])

  useEffect(() => { getAuthCache() }, [getAuthCache])
  useEffect(() => { sync() }, [sync])

  maybeCompleteAuthSession()

  if (loading) {
    return <CenterSquare title="Loading~" />
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
