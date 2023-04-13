import axios from "axios"

import { handle } from ".modules/axios_utils"
import { Content, Message } from ".modules/trinity"

const fetchBatchSize = 10

let mu = 1

export async function fetchMore(fetchEndpoint: string, [messages, setMessages]: [Message[], (messages: Message[]) => void]) {
  mu--

  const req: FetchRequest = {
    before_timestamp: messages.length !== 0 ? messages[messages.length - 1]._ts : 0,
    after_timestamp: 0,
    count: fetchBatchSize,
  }

  try {
    const resp = await axios.post<FetchResponse>(fetchEndpoint, req)
    setMessages([...messages, ...resp.data.messages])
  } catch (err) {
    handle(err)
  }

  mu++
}

export async function pollUpdate(fetchEndpoint: string, [messages, setMessages]: [Message[], (messages: Message[]) => void]) {
  mu--
  if (mu < 0) {
    mu++
    return
  }

  if (messages.length === 0) {
    mu++
    return
  }

  const latest_timestamp = messages[0]._ts

  const req: FetchRequest = {
    before_timestamp: 0,
    after_timestamp: latest_timestamp,
    count: 0
  }


  const m = new Set<string>()
  for (const message of messages.filter(message => message._ts === latest_timestamp)) {
    m.add(message.id)
  }

  try {
    const resp = await axios.post<FetchResponse>(fetchEndpoint, req)
    setMessages([...resp.data.messages.filter(message => message._ts !== latest_timestamp || !m.has(message.id)), ...messages])
  } catch (err) {
    handle(err)
  }

  mu++
}

export async function post(postEndpoint: string, content: Content) {
  if (content.length === 0) {
    console.warn("empty post")
    return
  }

  const req: PostRequest = { content }

  try {
    await axios.post(postEndpoint, req)
  } catch (err) {
    handle(err)
  }
}

type FetchRequest = {
  before_timestamp: number,
  after_timestamp: number,
  count: number,
}

type FetchResponse = {
  messages: Message[],
}

type PostRequest = {
  content: Content,
}
