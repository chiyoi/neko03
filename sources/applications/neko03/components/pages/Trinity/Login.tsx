import { useEffect, useState } from "react"
import { Prompt, TokenResponse, exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery } from "expo-auth-session"

import { Button, Paragraph, Stack, YStack, GetProps, useMedia, } from "tamagui"

import { centralized } from ".assets/styles"
import CenterSquare from ".components/CenterSquare"
import ErrorDialog from ".components/ErrorDialog"
import { setCache } from ".components/pages/Trinity/auth"
import { useAssets } from "expo-asset"
import ColorAvatar from ".components/ColorAvatar"
import { config } from ".modules/config"

const clientId = config.ClientIDAzureAD
const scopes = ["User.Read", "offline_access"]
const authorizationEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
const tokenEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

const styleFrame: GetProps<typeof YStack> = {
  backgroundColor: "$color3",
  borderRadius: "$5",
  elevation: 1,
  height: 200,
  width: 500,
}

const styleTitle: GetProps<typeof Paragraph> = {
  color: "$color7",
  fontFamily: "$neko",
  margin: "$3",
  padding: "$1",
  size: "$9",
}

const styleButton: GetProps<typeof Button> = {
  color: "$color8",
  fontFamily: "$neko",
}

export default function Login({ setAuth }: Props) {
  const media = useMedia()
  const [assets, err] = useAssets([require(".assets/icons/microsoft.png")])
  if (err !== undefined) {
    console.error(err)
  }

  const [request, response, promptAsync] = useAuthRequest({
    clientId, scopes,
    redirectUri: makeRedirectUri({ path: "trinity" }),
    prompt: Prompt.SelectAccount,
    usePKCE: false,
  }, { authorizationEndpoint })

  const [codeState, setCodeState] = useState<boolean | string>(false)

  useEffect(() => {
    if (request !== null && response !== null && response.type === "success") {
      exchangeCodeAsync({
        clientId,
        code: response.params["code"],
        redirectUri: makeRedirectUri({ path: "trinity" }),
      }, {
        tokenEndpoint,
      }).then(auth => {
        setAuth(auth)
        setCache(auth)
      }).catch(err => {
        console.error(err)
        setCodeState(`${err}`)
      })
    }
  }, [request, response])

  if (typeof codeState === "string") {
    return <ErrorDialog message={codeState} />
  }

  if (response !== null) {
    return response.type === "opened" || response.type === "success" || response.type === "locked" ? (
      <CenterSquare title="Resolving~" />
    ) : response.type === "error" ? (
      <ErrorDialog message={response.error?.description || ""} />
    ) : response.type === "cancel" || response.type === "dismiss" ? (
      <ErrorDialog message="Login canceled~" />
    ) : null
  }

  return (
    <Stack {...centralized} theme="pink" backgroundColor="$background">
      <YStack {...styleFrame} scale={media.xs ? 0.7 : 1.0}>
        <Paragraph {...styleTitle}>
          Which cat you are?
        </Paragraph>
        <Stack {...centralized}>
          <Button {...styleButton} disabled={request === null} onPress={() => { promptAsync() }}>
            <ColorAvatar uri={assets?.[0].localUri ?? undefined} size={25} />
            Login with Microsoft
          </Button>
        </Stack>
      </YStack>
    </Stack>
  )
}

interface Props {
  setAuth: React.Dispatch<React.SetStateAction<TokenResponse | null>>,
}
