import Constants from "expo-constants"
import { Link } from "expo-router"
import { maybeCompleteAuthSession } from "expo-web-browser"
import { useEffect, useState } from "react"

import { Button, GetProps, Paragraph, Popover, ScrollView, XStack, YStack } from "tamagui"

import MessageList from ".components/pages/Trinity/MessageList"
import { Message, ParagraphType, Partition } from ".modules/trinity"
import CenterSquare from ".components/CenterSquare"
import Login from ".components/pages/Trinity/Login"
import { stylePopover, topRightIconButton } from ".assets/styles"
import BackButton from ".components/BackButton"
import PinkFallbackAvatar from ".components/PinkFallbackAvatar"
import axios from "axios"
import { DiscoveryDocument, TokenResponse, revokeAsync, useAutoDiscovery } from "expo-auth-session"
import ErrorDialog from ".components/pages/Trinity/pieces/ErrorDialog"
import { createURL } from "expo-linking"

maybeCompleteAuthSession()

const serviceEndpoint = Constants.manifest?.extra?.ServiceEndpoint

const clientId = Constants.manifest?.extra?.AzureADApplicationClientID
const discoveryEndpoint = "https://login.microsoftonline.com/common/v2.0"
const logoutEndpoint = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${createURL("/trinity")}`

const checkEndpoint = new URL("/trinity/check", serviceEndpoint).href
const avatarURL = new URL("/trinity/avatar/me", serviceEndpoint).href
const nameURL = new URL("/trinity/name", serviceEndpoint).href

function styleAvatarButton(avatarSrc: string): GetProps<typeof Button> {
  return {
    ...topRightIconButton,
    color: "$pink8",
    icon: <PinkFallbackAvatar imageSrc={avatarSrc} size={30} />
  }
}

const testMessages: Message[] = Array(1).fill(null).map((_, i) => {
  return {
    sender_id: "0ee64caa-d6fd-432d-b03e-41e41efe704a",
    content: [{
      type: ParagraphType.Text,
      data: "nyan",
    }, {
      type: ParagraphType.Image,
      data: "IMG_4618.png/c49b7ec52961eb94f1d7cf4c8164f938",
    }, {
      type: 12345 as ParagraphType,
      data: "nyan2",
    }],
    tags: [],
    id: `test-message-${i}`,
    partition: Partition.Message,
    _ts: 1,
    sender_name: {
      display_name: "chiyoi",
      user_principal_name: "neko0001chiyoi",
    },
  }
})

export default function Trinity() {
  const discovery = useAutoDiscovery(discoveryEndpoint)
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState<TokenResponse | null>(null)
  useEffect(() => { initiate(auth, setAuth, setLoading, discovery) }, [auth, clientId])

  const [syncState, setSyncState] = useState<boolean | string>(false)
  useEffect(() => {
    if (auth !== null) {
      sync(auth.accessToken, setSyncState)
    }
  }, [auth])

  const [name, setName] = useState<Name | null>(null)
  useEffect(() => {
    if (auth !== null) {
      getName(setName)
    }
  }, [auth])

  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => setMessages(testMessages), [testMessages]) // TEST

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

  if (name === null) {
    return Loading
  }

  return (
    <>
      <ScrollView height="100%" backgroundColor="$background">
        <MessageList messages={messages} />
      </ScrollView>

      <BackButton />

      <Popover placement="bottom-end">
        <Popover.Trigger asChild>
          <Button {...styleAvatarButton(avatarURL)} />
        </Popover.Trigger>

        <Popover.Content {...stylePopover} backgroundColor="$pink3">
          <Popover.Arrow backgroundColor="$pink3" />

          <YStack space>
            <Paragraph size="$6" fontFamily="$neko" paddingEnd={30}>{name.display_name}</Paragraph>
            <Paragraph size="$3" fontFamily="$neko" paddingEnd={30}>{name.user_principal_name}</Paragraph>

            <XStack justifyContent="flex-end">
              <Link asChild href={logoutEndpoint}>
                <Button fontFamily="$neko">logout</Button>
              </Link>
            </XStack>
          </YStack>
        </Popover.Content>
      </Popover>
    </>
  )
}

async function initiate(auth: TokenResponse | null, setAuth: (auth: TokenResponse) => void, setLoading: (loading: boolean) => void, discovery: DiscoveryDocument | null) {
  if (auth !== null && discovery !== null && auth.shouldRefresh()) {
    await refresh(auth, setAuth, discovery)
  }
  setLoading(false)
  return
}

async function refresh(auth: TokenResponse, setAuth: (auth: TokenResponse) => void, discovery: DiscoveryDocument) {
  setAuth(await auth.refreshAsync({ clientId }, discovery))
}

async function sync(token: string, setSyncState: (state: boolean | string) => void) {
  const req = {
    access_token: token
  }

  type VerifyResponse = {
    passed: boolean,
    message?: string,
  }
  const resp = await axios.post<VerifyResponse>(checkEndpoint, req)
  if (resp.data.passed) {
    setSyncState(true)
  } else {
    setSyncState(resp.data.message || "Unknown error~")
  }
}

async function getName(setName: (name: Name) => void) {
  const resp = await axios.get<Name>(nameURL)
  setName(resp.data)
}

export type Name = {
  display_name: string,
  user_principal_name: string,
}
