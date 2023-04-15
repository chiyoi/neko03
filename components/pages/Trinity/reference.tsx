import { Reference } from ".modules/trinity"
import axios from "axios"
import Constants from "expo-constants"

const serviceEndpoint = Constants.manifest?.extra?.ServiceEndpoint

const uploadEndpoint = new URL("/trinity/upload/", serviceEndpoint).href

export async function upload(name: string, data: string): Promise<string> {
  await axios.put<Reference>(uploadEndpoint + name, data)
  return ""
}
