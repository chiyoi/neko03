FROM golang:1.20

WORKDIR /nacho
COPY sources/services/nacho/go.* .
RUN go mod download

COPY sources/services/nacho .
RUN CGO_ENABLED=0 go build -o app .

FROM alpine:3.16

WORKDIR /nacho
COPY --from=0 /nacho/app /bin/app

EXPOSE 80

CMD ["app"]
