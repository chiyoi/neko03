import { useEffect, useState } from "react"
import { KeyboardAvoidingView } from "react-native"
import { TokenResponse } from "expo-auth-session"

import MessageList from ".components/pages/Trinity/MessageList"
import CenterSquare from ".components/CenterSquare"
import Login from ".components/pages/Trinity/Login"
import BackButton from ".components/BackButton"
import ErrorDialog from ".components/ErrorDialog"
import Me from ".components/pages/Trinity/Me"
import { AuthContext, getCache, sync } from ".components/pages/Trinity/auth"
import Messaging from ".components/pages/Trinity/Messaging"

export default function Trinity() {
  const [loading, setLoading] = useState(true)

  const [auth, setAuth] = useState<TokenResponse | null>(null)
  useEffect(() => { initiate(auth, setAuth, setLoading) }, [auth])

  const [syncState, setSyncState] = useState<boolean | string>(false)
  useEffect(() => {
    if (auth !== null) {
      sync(auth.accessToken, setSyncState)
    }
  }, [auth])

  const Loading = <CenterSquare title="Loading~" />

  if (loading) {
    return Loading
  }

  if (auth === null) {
    return <Login setAuth={setAuth} />
  }

  if (syncState === false) {
    return Loading
  }

  if (syncState !== true) {
    return <ErrorDialog message={syncState} />
  }

  return (
    <AuthContext.Provider value={auth}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}>
        <MessageList />

        <Messaging />

        <BackButton />
        <Me />
      </KeyboardAvoidingView>
    </AuthContext.Provider>
  )
}

async function initiate(auth: TokenResponse | null, setAuth: (auth: TokenResponse) => void, setLoading: (loading: boolean) => void) {
  if (auth === null) {
    auth = await getCache()
    auth !== null && setAuth(auth)
  }
  setLoading(false)
  return
}
