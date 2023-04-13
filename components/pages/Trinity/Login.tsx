import { AuthRequest, AuthSessionResult, DiscoveryDocument, TokenResponse, exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery } from "expo-auth-session"
import { maybeCompleteAuthSession } from "expo-web-browser"
import Constants from "expo-constants"

import { Button, Paragraph, Stack, YStack, Avatar, GetProps, useMedia, AlertDialog, XStack } from "tamagui"

import { centralized } from ".assets/styles"
import CenterSquare from ".components/CenterSquare"
import { Link } from "expo-router"
import { useContext, useEffect } from "react"
import { createURL, openURL } from "expo-linking"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ErrorDialog from ".components/pages/Trinity/pieces/ErrorDialog"
import { Platform } from "react-native"

maybeCompleteAuthSession()

const serviceEndpoint = Constants.manifest?.extra?.ServiceEndpoint

const clientId = Constants.manifest?.extra?.AzureADApplicationClientID
const discoveryEndpoint = "https://login.microsoftonline.com/common/v2.0"

const redirectUri = Platform.OS === "web" ? (
  process.env.ENV === "prod" ? (
    "https://neko03.moe/trinity"
  ) : (
    "http://localhost/trinity"
  )
) : (
  "exp://silver.local:19000/--/trinity"
)

const iconMicrosoftURL = new URL("/assets/microsoft.png", serviceEndpoint).href

const styleFrame: GetProps<typeof YStack> = {
  backgroundColor: "$pink4",
  borderColor: "$pink5",
  borderRadius: "$5",
  borderWidth: 1,
  elevation: 1,
  height: 200,
  width: 500,
}

const styleTitle: GetProps<typeof Paragraph> = {
  color: "$pink8",
  fontFamily: "$neko",
  margin: "$3",
  padding: "$1",
  size: "$9",
}

const styleLoginButton: GetProps<typeof Button> = {
  backgroundColor: "$pink5",
  fontFamily: "$neko",
  margin: "$4",
  size: "$3",
}

export default function Login({ setAuth }: Props) {
  const discovery = useAutoDiscovery(discoveryEndpoint)
  const [request, response, promptAsync] = useAuthRequest({
    clientId,
    scopes: ["User.Read", "offline_access"],
    redirectUri,
    extraParams: { prompt: "select_account" },
    usePKCE: false,
  }, discovery)

  const media = useMedia()

  useEffect(() => {
    if (discovery !== null && request !== null && response !== null && response.type === "success") {
      exchangeCode(response.params.code, discovery, setAuth)
    }
  }, [response])

  if (response !== null) {
    return response.type === "opened" || response.type === "success" || response.type === "locked" ? (
      <CenterSquare title="Logging in~" />
    ) : response.type === "error" ? (
      <ErrorDialog message={response.error?.description || ""} />
    ) : response.type === "cancel" || response.type === "dismiss" ? (
      <CenterSquare title="Login canceled~" />
    ) : null
  }

  return (
    <Stack {...centralized} theme="pink" backgroundColor="$pink3">
      <YStack {...styleFrame} scale={media.xs ? 0.7 : 1.0}>
        <Paragraph {...styleTitle}>
          Which cat you are?
        </Paragraph>
        <Stack {...centralized}>
          <Button {...styleLoginButton} disabled={request === null} onPress={() => { promptAsync() }}>
            <Avatar size={25}>
              <Avatar.Image src={iconMicrosoftURL} />
              <Avatar.Fallback backgroundColor="$pink6" />
            </Avatar>
            Login with Microsoft
          </Button>
        </Stack>
      </YStack>
    </Stack>
  )
}

async function exchangeCode(code: string, discovery: DiscoveryDocument, setAuth: (auth: TokenResponse) => void) {
  setAuth(await exchangeCodeAsync({ code, clientId, redirectUri }, discovery))
}

interface Props {
  setAuth: (auth: TokenResponse | null) => void,
}
