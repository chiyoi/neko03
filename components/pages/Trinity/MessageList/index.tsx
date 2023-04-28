import { useEffect, useState } from "react"
import { FlatList } from "react-native"

import { ListItem, Paragraph, Stack, YGroup, GetProps, SizableText } from "tamagui"

import { ParagraphType } from ".modules/trinity"
import ColorBackAvatar from ".components/ColorAvatar"
import { NamedMessage, fetchEarlier, fetchLatest, polling } from ".components/pages/Trinity/message"
import ParagraphImage from ".components/pages/Trinity/MessageList/ParagraphImage"
import ParagraphFile from ".components/pages/Trinity/MessageList/ParagraphFile"
import { config } from ".modules/config"

const serviceEndpoint = config.EndpointService()

const avatarEndpoint = new URL("/trinity/avatar/", serviceEndpoint).href

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

  useEffect(() => {
    fetchLatest(setMessages)
    return () => setMessages([])
  }, [])

  useEffect(() => {
    return polling(setMessages)
  }, [messages])

  return (
    <Stack height="100%" backgroundColor="$background">
      <FlatList inverted onEndReached={() => fetchEarlier(messagesState)} data={messages} renderItem={({ item: message }) => (
        <ListItem {...styleMessage(avatarEndpoint + message.sender_id, message)}>
          <YGroup paddingHorizontal="$2">
            {message.content.map((paragraph, i) => (
              <Stack key={i}>
                {paragraph.type === ParagraphType.Text ? (
                  <Paragraph>{paragraph.data}</Paragraph>
                ) : paragraph.type === ParagraphType.Image ? (
                  <ParagraphImage data={paragraph.data} />
                ) : paragraph.type === ParagraphType.Record ? (
                  <Paragraph color="grey">(Unsupported paragraph type~)</Paragraph>
                ) : paragraph.type === ParagraphType.Video ? (
                  <Paragraph color="grey">(Unsupported paragraph type~)</Paragraph>
                ) : paragraph.type === ParagraphType.File ? (
                  <ParagraphFile data={paragraph.data} />
                ) : (
                  <Paragraph color="grey">(Unknown paragraph type~)</Paragraph>
                )}
              </Stack>
            ))}
          </YGroup>
        </ListItem>
      )} />
    </Stack>
  )
}
