import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, View } from "react-native"

import { ListItem, Paragraph, Stack, YGroup, GetProps, SizableText, ToastProvider, ToastViewport, ScrollView } from "tamagui"

import { Message, Name, ParagraphType } from ".modules/trinity"
import ColorBackAvatar from ".components/ColorAvatar"
import ParagraphImage from ".components/pages/Trinity/MessageList/ParagraphImage"
import ParagraphFile from ".components/pages/Trinity/MessageList/ParagraphFile"
import { config } from ".modules/config"
import { styleBounceDown } from ".assets/styles"
import axios from "axios"
import Remove from ".components/pages/Trinity/MessageList/Remove"
import { Toast } from "@tamagui/toast"
import { documentDirectory, downloadAsync } from "expo-file-system"
import { shareAsync } from "expo-sharing"
import { errorMessage } from ".modules/axios_utils"
import { AuthContext, header, query } from ".components/pages/Trinity/auth"
import CenterSquare from ".components/CenterSquare"
import { ToastContext } from ".modules/toast"

const endpointFetchLatest = new URL("/trinity/fetch/latest", config.EndpointService).href
const endpointFetchEarlier = new URL("/trinity/fetch/earlier", config.EndpointService).href
const endpointFetchUpdate = new URL("/trinity/fetch/update", config.EndpointService).href

const endpointAvatar = new URL("/trinity/avatar/", config.EndpointService).href
const endpointRemove = new URL("/trinity/remove/", config.EndpointService).href

const formatTimestamp: Intl.DateTimeFormatOptions = {
  hourCycle: "h24",
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}

const styleMessage: GetProps<typeof ListItem> = {
  alignItems: "flex-start",
  padding: "$3.5",
  borderRadius: "$5",
}

export default function MessageList() {
  const auth = useContext(AuthContext)
  const toast = useContext(ToastContext)

  const messagesState = useState<NamedMessage[]>([])
  const [messages, setMessages] = messagesState

  const [synced, setSynced] = useState(false)

  const shareMu = useRef(1)
  const sharing = useMemo(() => shareMu.current <= 0, [])

  const fetchLatest = useCallback(() => {
    console.log("fetching latest messages")
    toast("Fetching latest messages~")
    axios.get<ResponseFetch>(endpointFetchLatest, { headers: header(auth) }).then(resp => {
      console.log("latest messages fetched")
      toast("Latest messages fetched~")
      setMessages(resp.data.messages)
      setSynced(true)
    }).catch(err => {
      console.warn(err)
      toast("Something went wrong~")
    })
  }, [auth])

  const fetchEarlier = useCallback(() => {
    if (messages.length === 0) {
      return
    }

    toast("Fetching earlier messages~")
    console.log("fetching earlier messages")

    const oldestTimestamp = messages.length && messages[messages.length - 1].timestamp
    const req: RequestFetchEarlier = {
      before_timestamp: oldestTimestamp,
    }

    axios.post<ResponseFetch>(endpointFetchEarlier, JSON.stringify(req), { headers: header(auth) }).then(resp => {
      console.log("earlier messages fetched")
      toast("Earlier messages fetched~")
      setMessages([...messages, ...resp.data.messages])
    }).catch(err => {
      console.warn(err)
      toast("Something went wrong~")
    })
  }, [auth, messages])

  const polling = useCallback(() => {
    if (!synced) {
      return
    }

    const source = axios.CancelToken.source()
    console.log("polling update")
    axios.get<ResponseFetch>(endpointFetchUpdate, { cancelToken: source.token, headers: header(auth) }).then(resp => {
      console.log("received update")
      setMessages(messages => [...resp.data.messages, ...messages])
    }).catch(err => {
      if (axios.isCancel(err)) {
        console.log(err.message)
      } else {
        console.warn(err)
      }
    })
    return () => source.cancel("cancel polling")
  }, [auth])

  const share = useCallback(async (filename: string, uri: string) => {
    shareMu.current--
    if (shareMu.current < 0) {
      shareMu.current++
      toast("Already downloading, please wait~")
      return
    }

    try {
      const file = documentDirectory + filename
      console.log(`download ${filename}`)
      toast("Downloading~")
      await downloadAsync(uri, file, { headers: header(auth) })
      await shareAsync(file)
    } catch (err) {
      console.warn(err)
      toast("Download failed~")
    }
    shareMu.current++
  }, [auth])

  const removeMessage = useCallback(async (mid: string) => {
    try {
      toast("Removing~")
      await axios.delete(endpointRemove + mid, { headers: header(auth) })
      setMessages(messages => messages.filter(m => m.id !== mid))
    } catch (err) {
      toast("Remove failed~")
      console.error(err)
    }
  }, [auth])

  useEffect(() => {
    fetchLatest()
    return () => {
      setMessages([])
      setSynced(false)
    }
  }, [])

  useEffect(polling)

  return (
    <Stack height="100%" backgroundColor="$background">
      <FlatList inverted onEndReached={fetchEarlier} data={messages} keyExtractor={item => item.id} renderItem={({ item: message }) => (
        <ListItem {...styleMessage} icon={(
          <ColorBackAvatar imageSrc={endpointAvatar + message.sender_id + "?" + query(auth)} size={25} />
        )} title={(
          <Paragraph fontFamily="$neko" size="$6" color="$color8">
            {message.sender_name.display_name}
            {message.sender_name.user_principal_name && (
              <SizableText fontFamily="$neko" color="$color7"> {message.sender_name.user_principal_name}</SizableText>
            )}
          </Paragraph>
        )} subTitle={(
          <Paragraph size="$2" color="$gray8">
            {new Date(message.timestamp).toLocaleString([], formatTimestamp)}
          </Paragraph>
        )}>
          <YGroup paddingHorizontal="$2">
            {message.content.map((paragraph, i) => (
              <Stack key={i}>
                {paragraph.type === ParagraphType.Text ? (
                  <Paragraph>{paragraph.data}</Paragraph>
                ) : paragraph.type === ParagraphType.Image ? (
                  <ParagraphImage data={paragraph.data} sharing={sharing} share={share} />
                ) : paragraph.type === ParagraphType.Record ? (
                  <Paragraph color="grey">(Unsupported paragraph type~)</Paragraph>
                ) : paragraph.type === ParagraphType.Video ? (
                  <Paragraph color="grey">(Unsupported paragraph type~)</Paragraph>
                ) : paragraph.type === ParagraphType.File ? (
                  <ParagraphFile data={paragraph.data} sharing={sharing} share={share} />
                ) : (
                  <Paragraph color="grey">(Unknown paragraph type~)</Paragraph>
                )}
              </Stack>
            ))}
          </YGroup>

          <Remove onConfirm={() => removeMessage(message.id)} />
        </ListItem>
      )} />
    </Stack >
  )
}

type RequestFetchEarlier = {
  before_timestamp: number,
}

type ResponseFetch = {
  messages: NamedMessage[],
}

type NamedMessage = Message & {
  sender_name: Name
}
