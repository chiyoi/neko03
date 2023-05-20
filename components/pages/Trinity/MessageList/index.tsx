import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"

import { ListItem, Paragraph, Stack, YGroup, GetProps, SizableText, ToastProvider, ToastViewport, ScrollView } from "tamagui"

import { Message, Name, ParagraphType } from ".modules/trinity"
import ColorAvatar from ".components/ColorAvatar"
import ParagraphImage from ".components/pages/Trinity/MessageList/ParagraphImage"
import ParagraphFile from ".components/pages/Trinity/MessageList/ParagraphFile"
import { config } from ".modules/config"
import axios, { AxiosError } from "axios"
import Remove from ".components/pages/Trinity/MessageList/Remove"
import { documentDirectory, downloadAsync } from "expo-file-system"
import { shareAsync } from "expo-sharing"
import { AuthContext, query } from ".components/pages/Trinity/auth"
import { ToastContext } from ".modules/toast"

const endpointFetchLatest = new URL("/trinity/fetch/latest", config.EndpointNeko03).href
const endpointFetchEarlier = new URL("/trinity/fetch/earlier", config.EndpointNeko03).href
const endpointFetchUpdate = new URL("/trinity/fetch/update", config.EndpointNeko03).href

const endpointAvatar = new URL("/trinity/avatar/", config.EndpointNeko03).href
const endpointRemove = new URL("/trinity/remove/", config.EndpointNeko03).href

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

    axios.get<ResponseFetch>(endpointFetchLatest + "?" + query(auth)).then(resp => {
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

    console.log("fetching earlier messages")
    toast("Fetching earlier messages~")
    const oldestTimestamp = messages.length && messages[messages.length - 1].timestamp
    axios.post<ResponseFetch>(endpointFetchEarlier + "?" + query(auth), JSON.stringify({
      before_timestamp: oldestTimestamp,
    })).then(resp => {
      console.log("earlier messages fetched")
      toast("Earlier messages fetched~")
      setMessages([...messages, ...resp.data.messages])
    }).catch(err => {
      console.warn(err)
      toast("Something went wrong~")
    })
  }, [auth, messages])

  const pollUpdate = useCallback(() => {
    if (!synced) {
      return
    }

    const source = axios.CancelToken.source()
    setTimeout(async () => {
      while (true) {
        try {
          console.log("polling update")
          const resp = await axios.get<ResponseFetch>(endpointFetchUpdate + "?" + query(auth), { cancelToken: source.token })
          console.log("received update")
          setMessages(messages => [...resp.data.messages, ...messages])
        } catch (err) {
          if (axios.isCancel(err)) {
            console.log(err.message)
            break
          } else if (err instanceof AxiosError && err.response !== undefined && err.response.status === axios.HttpStatusCode.GatewayTimeout) {
            console.log("poll timeout")
          } else {
            console.warn(err)
          }
        }
      }
    })
    return () => source.cancel("cancel polling")
  }, [synced, auth])

  const share = useCallback((filename: string, uri: string) => {
    shareMu.current--
    if (shareMu.current < 0) {
      shareMu.current++
      console.log("already downloading")
      toast("Already downloading, please wait~")
      return
    }

    const file = documentDirectory + filename
    console.log(`download ${filename}`)
    toast("Downloading~")
    downloadAsync(uri + "?" + query(auth), file).then(() => {
      return shareAsync(file)
    }).catch(err => {
      console.warn(err)
      toast("Download failed~")
    }).finally(() => {
      shareMu.current++
    })
  }, [auth])

  const removeMessage = useCallback((mid: string) => {
    toast("Removing~")
    axios.delete(endpointRemove + mid + "?" + query(auth)).then(() => {
      toast("Removed.")
      setMessages(messages => messages.filter(m => m.id !== mid))
    }).catch(err => {
      toast("Remove failed~")
      console.error(err)
    })
  }, [auth])

  useEffect(() => {
    fetchLatest()
    return () => {
      setMessages([])
      setSynced(false)
    }
  }, [fetchLatest])

  useEffect(pollUpdate)

  return (
    <Stack height="100%" backgroundColor="$background">
      <FlatList inverted onEndReached={fetchEarlier} data={messages} keyExtractor={item => item.id} renderItem={({ item: message }) => (
        <ListItem {...styleMessage} icon={(
          <ColorAvatar size={25} uri={endpointAvatar + message.sender_id + "?" + query(auth)} />
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

type ResponseFetch = {
  messages: NamedMessage[],
}

type NamedMessage = Message & {
  sender_name: Name
}
