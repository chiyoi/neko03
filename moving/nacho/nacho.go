package nacho

import (
	_ "image/jpeg"
	_ "image/png"
	"net/http"

	"github.com/chiyoi/go/pkg/az/blob"
	"github.com/chiyoi/go/pkg/logs"
	"github.com/chiyoi/go/pkg/neko"
	"github.com/chiyoi/neko03/internal/app/neko03/config"
)

func PatternHandler(pattern string) (string, http.Handler) {
	resolve := neko.PathResolver(pattern)
	mux := http.NewServeMux()

	nacho, err := blob.Client(config.EndpointAzureBlob)
	if err != nil {
		logs.Panic(err)
	}

	mux.Handle(resolve("/image_list.json"), ListImageHandler(resolve("/images/"), nacho))
	mux.Handle(GetImagePatternHandler(resolve("/images/"), nacho))
	return pattern, mux
}
