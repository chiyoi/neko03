package api

import (
	"net/http"
	"os"

	"github.com/chiyoi/apricot/neko"
	"github.com/chiyoi/neko03/services/nacho/api/image"
)

func Run() {
	srv := &http.Server{
		Addr:    Addr(),
		Handler: neko.AllowCrossOrigin(RootHandler()),
	}

	go neko.StartServer(srv, false)
	defer neko.StopServer(srv)

	neko.Block()
}

func Addr() string {
	if os.Getenv("ENV") == "prod" {
		return ":http"
	}
	return ":7147"
}

// RootHandler:
// * /warmup
// * /image/
func RootHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/warmup", neko.WarmupHandler())
	mux.Handle(image.PatternHandler("/image/"))
	mux.Handle("/", neko.TeapotHandler("Nyan~"))
	return mux
}
