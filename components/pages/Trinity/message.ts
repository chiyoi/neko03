import axios from "axios"

import { Paragraph, Message, Name } from ".modules/trinity"
import { config } from ".modules/config"

const serviceEndpoint = config.EndpointService()

const fetchEndpoint = new URL("/trinity/fetch", serviceEndpoint).href
const postEndpoint = new URL("/trinity/post", serviceEndpoint).href

const fetchBatchSize = 10

let mu = 1

export async function fetchOlder([messages, setMessages]: StateNamedMessageArray) {
  mu--
  console.log("fetching older history")

  const oldestTimestamp = messages.length && messages[messages.length - 1]._ts
  const req: FetchRequest = {
    before_timestamp: oldestTimestamp,
    count: fetchBatchSize,
    after_timestamp: 0,
  }

  const resp = await axios.post<FetchResponse>(fetchEndpoint, req)
  setMessages([...messages, ...resp.data.messages])

  mu++
}

export async function pollNewer([messages, setMessages]: StateNamedMessageArray) {
  if (messages.length === 0) {
    return
  }

  mu--
  if (mu < 0) {
    mu++
    return
  }
  console.log("polling newer update")

  const newestTimestamp = messages[0]._ts
  const req: FetchRequest = {
    before_timestamp: 0,
    count: 0,
    after_timestamp: newestTimestamp,
  }


  const m = new Set<string>()
  for (const message of messages.filter(message => message._ts === newestTimestamp)) {
    m.add(message.id)
  }

  const resp = await axios.post<FetchResponse>(fetchEndpoint, req)
  setMessages([...resp.data.messages.filter(message => message._ts !== newestTimestamp || !m.has(message.id)), ...messages])

  mu++
}

export async function post(content: Paragraph[]) {
  if (content.length === 0) {
    console.warn("empty post")
    return
  }
  const req: PostRequest = { content }
  await axios.post(postEndpoint, req)
}

type FetchRequest = {
  before_timestamp: number,
  count: number,
  after_timestamp: number,
}

type FetchResponse = {
  messages: NamedMessage[],
}

type PostRequest = {
  content: Paragraph[],
}

export type NamedMessage = Message & {
  sender_name: Name
}

type StateNamedMessageArray = [NamedMessage[], React.Dispatch<React.SetStateAction<NamedMessage[]>>]
