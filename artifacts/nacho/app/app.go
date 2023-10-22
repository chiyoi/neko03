package app

import (
	"net/http"
	"os"

	"github.com/chiyoi/apricot/logs"
	"github.com/chiyoi/apricot/neko"
	"github.com/chiyoi/neko03/services/nacho/app/image"
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
// * /ping
// * /readiness
// * /image/
func RootHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/ping", neko.PingHandler())
	mux.HandleFunc("/readiness", func(w http.ResponseWriter, r *http.Request) {
		logs.Info("Readiness probe.")
	})
	mux.Handle(image.PatternHandler("/image/"))
	mux.Handle("/image", neko.RedirectToSlashHandler())
	mux.Handle("/", neko.TeapotHandler())
	return mux
}
