import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"

import { ListItem, Paragraph, Stack, YGroup, GetProps, SizableText, Button, ScrollView, ToastProvider, ToastViewport } from "tamagui"

import { ParagraphType } from ".modules/trinity"
import ColorBackAvatar from ".components/ColorAvatar"
import { NamedMessage, fetchEarlier, fetchLatest, polling } from ".components/pages/Trinity/message"
import ParagraphImage from ".components/pages/Trinity/MessageList/ParagraphImage"
import ParagraphFile from ".components/pages/Trinity/MessageList/ParagraphFile"
import { config } from ".modules/config"
import { styleBounceDown, styleIconButton } from ".assets/styles"
import axios from "axios"
import { Trash } from "@tamagui/lucide-icons"
import Remove from ".components/pages/Trinity/MessageList/Remove"
import { Toast } from "@tamagui/toast"
import { documentDirectory, downloadAsync } from "expo-file-system"
import { shareAsync } from "expo-sharing"

const endpointService = config.EndpointService()

const endpointAvatar = new URL("/trinity/avatar/", endpointService).href
const endpointRemove = new URL("/trinity/remove/", endpointService).href

function styleMessage(senderAvatarSrc: string, message: NamedMessage): GetProps<typeof ListItem> {
  const formatTimestamp: Intl.DateTimeFormatOptions = {
    hourCycle: "h24",
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }

  return {
    alignItems: "flex-start",
    padding: "$3.5",
    borderRadius: "$5",
    icon: <ColorBackAvatar imageSrc={senderAvatarSrc} size={25} />,
    title: (
      <Paragraph fontFamily="$neko" size="$6" color="$color8">
        {message.sender_name.display_name}
        {message.sender_name.user_principal_name && (
          <SizableText fontFamily="$neko" color="$color7"> {message.sender_name.user_principal_name}</SizableText>
        )}
      </Paragraph>
    ),
    subTitle: (
      <Paragraph size="$2" color="$gray8">
        {new Date(message.timestamp).toLocaleString([], formatTimestamp)}
      </Paragraph>
    )
  }
}

export default function MessageList() {
  const messagesState = useState<NamedMessage[]>([])
  const [messages, setMessages] = messagesState

  const [toast, setToast] = useState<string>("")
  const toastOpen = useMemo(() => toast !== "", [toast])
  const setToastOpen = useCallback((toastOpen: boolean) => setToast(toastOpen ? "Unknown notice~" : ""), [])

  const shareMu = useRef(1)
  const sharing = useMemo(() => shareMu.current <= 0, [])

  const share = useCallback((filename: string, uri: string) => {
    (async () => {
      shareMu.current--
      if (shareMu.current < 0) {
        shareMu.current++
        setToast("Already downloading, please wait~")
        return
      }

      try {
        setToast("Downloading~")
        const file = documentDirectory + filename
        console.log(`download ${filename}`)
        await downloadAsync(uri, file)
        await shareAsync(file)
      } catch (err) {
        console.error(err)
        setToast("Download failed~")
      }
      shareMu.current++
    })()
  }, [])

  const removeMessage = useCallback((mid: string) => {
    (async () => {
      try {
        setToast("Removing~")
        await axios.delete(endpointRemove + mid)
        setMessages(messages => messages.filter(m => m.id !== mid))
      } catch (err) {
        setToast("Remove failed~")
        console.error(err)
      }
    })()
  }, [])

  const fetchEarlierMessages = useCallback(() => {
    setToast("Fetching earlier messages~")
    fetchEarlier(messagesState)
  }, [])

  useEffect(() => {
    setToast("Fetching latest messages~")
    fetchLatest(setMessages)
    return () => setMessages([])
  }, [])

  useEffect(() => polling(setMessages))

  return (
    <>
      <Stack height="100%" backgroundColor="$background">
        <FlatList inverted onEndReached={fetchEarlierMessages} data={messages} renderItem={({ item: message }) => (
          <ListItem {...styleMessage(endpointAvatar + message.sender_id, message)} key={message.id}>
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


      <ToastProvider duration={2000}>
        <Toast {...styleBounceDown} top={30} open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title color="$color8">{toast}</Toast.Title>
        </Toast>

        <ToastViewport alignSelf="center" />
      </ToastProvider>
    </>
  )
}
