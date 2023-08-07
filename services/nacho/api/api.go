package api

import (
	"net/http"
	"os"

	"github.com/chiyoi/apricot/neko"
	"github.com/chiyoi/neko03/services/nacho/api/image"
)

func Run() {
	srv := &http.Server{
		Addr:    os.Getenv("ADDR"),
		Handler: neko.AllowCrossOrigin(RootHandler()),
	}

	go neko.StartServer(srv, false)
	defer neko.StopServer(srv)

	neko.Block()
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
