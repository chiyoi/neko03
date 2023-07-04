FROM golang:1.20

WORKDIR /nacho
COPY go.* .
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o a.out ./main

FROM alpine:3.16

WORKDIR /nacho
COPY --from=0 /nacho/a.out /bin/nacho

EXPOSE 80

CMD ["nacho"]
