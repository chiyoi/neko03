import Constants from "expo-constants"

import { Avatar, ListItem, Paragraph, Stack, YGroup, GetProps, Image } from "tamagui"

import { Message, ParagraphType } from ".modules/trinity"
import { useEffect, useMemo, useState } from "react"

const serviceEndpoint: string = Constants.manifest?.extra?.ServiceEndpoint

const avatarEndpoint = new URL("/trinity/avatar/", serviceEndpoint).href
const downloadEndpoint = new URL("/trinity/download/", serviceEndpoint).href

const formatTimestamp: Intl.DateTimeFormatOptions = {
  hourCycle: "h24",
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}

function styleMessage(senderAvatarSrc: string, message: Message): GetProps<typeof ListItem> {
  return {
    alignItems: "flex-start",
    icon: (
      <Avatar size={25} circular>
        <Avatar.Image src={senderAvatarSrc} />
        <Avatar.Fallback backgroundColor="$pink5" />
      </Avatar>
    ),
    title: (
      <Paragraph size="$6">
        {message.sender_name.display_name}{message.sender_name.user_principal_name && ` (${message.sender_name.user_principal_name})`}
      </Paragraph>
    ),
    subTitle: (
      <Paragraph size="$2" color="grey">
        {new Date(message._ts * 1000).toLocaleString([], formatTimestamp)}
      </Paragraph>
    )
  }
}

export default function MessageList({ messages }: Props) {
  return (
    <YGroup>
      {messages.slice().reverse().map(message => (
        <YGroup.Item key={message.id}>
          <ListItem {...styleMessage(avatarEndpoint + message.sender_id, message)} >
            <YGroup>
              {message.content.map((paragraph, i) => (
                <Stack key={i}>
                  {paragraph.type === ParagraphType.Text ? (
                    <Paragraph>{paragraph.data}</Paragraph>
                  ) : paragraph.type === ParagraphType.Image ? (
                    <Image width={300} height={300} resizeMode="contain" src={downloadEndpoint + paragraph.data} />
                  ) : paragraph.type === ParagraphType.Record ? (
                    <></>
                  ) : paragraph.type === ParagraphType.Video ? (
                    <></>
                  ) : paragraph.type === ParagraphType.File ? (
                    <></>
                  ) : (
                    <Paragraph color="grey">(Unknown paragraph type~)</Paragraph>
                  )}
                </Stack>
              ))}
            </YGroup>
          </ListItem>
        </YGroup.Item>
      ))}
    </YGroup>
  )
}

type Props = {
  messages: Message[],
}

