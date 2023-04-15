import Constants from "expo-constants"
import { useCallback, useEffect, useRef, useState } from "react"
import { FlatList } from "react-native"

import { ListItem, Paragraph, Stack, YGroup, GetProps, Image, SizableText } from "tamagui"

import { Message, ParagraphType, Partition } from ".modules/trinity"
import PinkFallbackAvatar from ".components/PinkFallbackAvatar"
import { NamedMessage, fetchOlder, pollNewer } from ".components/pages/Trinity/message"
import ParagraphImage from ".components/pages/Trinity/MessageList/ParagraphImage"
import ParagraphFile from ".components/pages/Trinity/MessageList/ParagraphFile"

const serviceEndpoint: string = Constants.manifest?.extra?.ServiceEndpoint

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
    icon: <PinkFallbackAvatar imageSrc={senderAvatarSrc} size={25} />,
    title: (
      <Paragraph fontFamily="$neko" size="$6" color="$pink9">
        {message.sender_name.display_name}
        {message.sender_name.user_principal_name && (
          <SizableText fontFamily="$neko" color="$pink7"> {message.sender_name.user_principal_name}</SizableText>
        )}
      </Paragraph>
    ),
    subTitle: (
      <Paragraph size="$2" color="grey">
        {new Date(message._ts * 1000).toLocaleString([], formatTimestamp)}
      </Paragraph>
    )
  }
}

export default function MessageList() {
  const messagesState = useState<NamedMessage[]>([])
  const [messages, setMessages] = messagesState
  useEffect(() => {
    fetchOlder([[], setMessages])
    return () => setMessages([])
  }, [])
  useEffect(() => {
    const worker = setInterval(() => pollNewer(messagesState), 10000) // TEST: longer poll interval
    return () => clearInterval(worker)
  }, [messages])

  return (
    <Stack height="100%" backgroundColor="$background">
      <FlatList inverted onEndReached={() => fetchOlder(messagesState)} data={messages} renderItem={({ item: message }) => (
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
