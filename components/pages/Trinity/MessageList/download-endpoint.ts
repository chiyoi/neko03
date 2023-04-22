import { config } from ".modules/config"

export const downloadEndpoint = new URL("/trinity/download/", config.EndpointService()).href
