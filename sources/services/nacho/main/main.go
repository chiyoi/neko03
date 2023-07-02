package main

import (
	"net/http"

	"github.com/chiyoi/go/pkg/logs"
	"github.com/chiyoi/go/pkg/neko"
	"github.com/chiyoi/neko03/sources/services/nacho/config"
)

func main() {
	srv := &http.Server{
		Addr:    config.Addr(),
		Handler: neko.AllowCrossOrigin(Handler()),
	}

	go neko.StartServer(srv, false)
	defer neko.StopServer(srv)

	neko.Block()
}

func Handler() http.Handler {
	mux := http.NewServeMux()

	blob, err := BlobClient(config.EndpointAzureBlob)
	if err != nil {
		logs.Panic(err)
	}

	mux.Handle("/warmup", neko.WarmupHandler())
	mux.Handle("/image_list.json", ListImageHandler("/images/", blob))
	mux.Handle(GetImagePatternHandler("/images/", blob))
	mux.Handle("/", neko.TeapotHandler("Nyan~"))
	return mux
}
