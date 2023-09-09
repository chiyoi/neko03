FROM golang:1.21
WORKDIR /nacho
COPY go.mod go.sum ./
RUN go mod download

COPY main.go ./
COPY app ./app
RUN CGO_ENABLED=0 go build -o nacho .

FROM alpine:3.18
WORKDIR /nacho
COPY --from=0 /nacho/nacho /bin/nacho

ENV VERSION="v0.1.0"
EXPOSE 80
CMD ["nacho"]
