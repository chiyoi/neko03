package main

import (
	"net/http"

	"github.com/chiyoi/go/pkg/az/blob"
	"github.com/chiyoi/go/pkg/logs"
	"github.com/chiyoi/go/pkg/neko"
	"github.com/chiyoi/neko03/sources/services/nacho/config"
)

func main() {
	srv := &http.Server{
		Addr:    config.Addr(),
		Handler: Handler(),
	}

	go neko.StartServer(srv, false)
	defer neko.StopServer(srv)

	neko.Block()
}

func Handler() http.Handler {
	mux := http.NewServeMux()

	nacho, err := blob.Client(config.EndpointAzureBlob)
	if err != nil {
		logs.Panic(err)
	}

	mux.Handle("/warmup", neko.WarmupHandler())
	mux.Handle("/image_list.json", ListImageHandler("/images/", nacho))
	mux.Handle(GetImagePatternHandler("/images/", nacho))
	return mux
}
