import { config } from ".modules/config"
import { Reference } from ".modules/trinity"
import axios from "axios"

const serviceEndpoint = config.EndpointService()

const uploadEndpoint = new URL("/trinity/upload/", serviceEndpoint).href

export async function upload(name: string, data: string): Promise<string> {
  await axios.put<Reference>(uploadEndpoint + name, data)
  return ""
}
