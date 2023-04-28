import axios from "axios"

import { Paragraph, Message, Name } from ".modules/trinity"
import { config } from ".modules/config"
import { uploadAsync } from "expo-file-system"
import { handle } from ".modules/axios_utils"

const endpointService = config.EndpointService()

const endpointFetchLatest = new URL("/trinity/fetch/latest", endpointService).href
const endpointFetchEarlier = new URL("/trinity/fetch/earlier", endpointService).href
const endpointFetchUpdate = new URL("/trinity/fetch/update", endpointService).href
const endpointPost = new URL("/trinity/post", endpointService).href
const endpointUpload = new URL("/trinity/upload/", endpointService).href

export async function fetchLatest(setMessages: StateNamedMessageArray[1]) {
  console.log("fetching latest messages")

  const resp = await axios.get<ResponseFetch>(endpointFetchLatest)
  setMessages(resp.data.messages)
}

export async function fetchEarlier([messages, setMessages]: StateNamedMessageArray) {
  if (messages.length === 0) {
    return
  }
  console.log("fetching earlier history")

  const oldestTimestamp = messages.length && messages[messages.length - 1].timestamp
  const req: RequestFetchEarlier = {
    before_timestamp: oldestTimestamp,
  }

  const resp = await axios.post<ResponseFetch>(endpointFetchEarlier, req)
  setMessages([...messages, ...resp.data.messages])
}

export function polling(setMessages: StateNamedMessageArray[1]): () => void {
  console.log("polling update")

  const source = axios.CancelToken.source()
  axios.get<ResponseFetch>(endpointFetchUpdate, { cancelToken: source.token }).then(resp => (
    setMessages(messages => [...resp.data.messages, ...messages])
  )).catch(err => axios.isCancel(err) ? (
    console.log(err.message)
  ) : (
    handle(err)
  ))

  return () => source.cancel("cancel polling")
}

export function post(content: Paragraph[]) {
  if (content.length === 0) {
    console.warn("empty post")
    return
  }

  const req: RequestPost = { content }
  axios.post(endpointPost, req)
}

export async function upload(name: string, uri: string): Promise<string> {
  const resp = await uploadAsync(endpointUpload + name, uri, { httpMethod: "PUT" })
  if (resp.status != 200) {
    console.warn("upload failed")
  }
  return JSON.parse(resp.body)
}

type RequestFetchEarlier = {
  before_timestamp: number,
}

type ResponseFetch = {
  messages: NamedMessage[],
}

type RequestPost = {
  content: Paragraph[],
}

export type NamedMessage = Message & {
  sender_name: Name
}

type StateNamedMessageArray = [NamedMessage[], React.Dispatch<React.SetStateAction<NamedMessage[]>>]
