import { AxiosError, type AxiosResponse } from "axios"

function statusString(resp: AxiosResponse) {
  return `[${resp.status}] ${resp.data}`
}

export function errorMessage(err: unknown): string {
  return err instanceof AxiosError ? (
    err.response !== undefined ? (
      statusString(err.response)
    ) : err.request !== undefined ? (
      "empty response"
    ) : (
      "failed to make request"
    )
  ) : (
    `${err}`
  )
}

export function handle(err: unknown) {
  console.error(errorMessage(err))
}
