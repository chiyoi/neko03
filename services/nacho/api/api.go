package api

import (
	"net/http"
	"os"

	"github.com/chiyoi/go/pkg/neko"
	"github.com/chiyoi/neko03/sources/services/nacho/api/image"
)

var (
	EndpointAzureBlob = os.Getenv("ENDPOINT_AZURE_BLOB")
	IsProd            = os.Getenv("ENV") == "prod"
)

func Main() {
	srv := &http.Server{
		Addr:    Addr(),
		Handler: neko.AllowCrossOrigin(Handler()),
	}

	go neko.StartServer(srv, false)
	defer neko.StopServer(srv)

	neko.Block()
}

func Addr() string {
	if IsProd {
		return ":http"
	}
	return ":7147"
}

func Handler() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("/warmup", neko.WarmupHandler())
	mux.Handle(image.PatternHandler("/image/"))
	mux.Handle("/", neko.TeapotHandler("Nyan~"))
	return mux
}
