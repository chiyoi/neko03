import { Paragraph } from ".modules/trinity/paragraph"

export type Message = {
  id: string
  timestamp: number
  sender_id: string
  content: Paragraph[]
}
