package image

import (
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/chiyoi/apricot/kitsune"
	"github.com/chiyoi/apricot/logs"
	"github.com/chiyoi/apricot/neko"
)

const (
	DirImages = "files/images"
)

// PatternHandler:
// GET /list.json
// GET /<filename>
func PatternHandler(pattern string) (string, http.Handler) {
	if !neko.IsWildcard(pattern) {
		logs.Panic(neko.ErrWildcardPatternNeeded)
	}

	return pattern, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			logs.Warning("Method not allowed.", r.Method)
			neko.MethodNotAllowed(w)
			return
		}

		p := neko.TrimPattern(r.URL.Path, pattern)
		if p == "list.json" {
			list, err := ListImages(pattern)
			if err != nil {
				logs.Error(err)
				kitsune.InternalServerError(w, nil)
				return
			}
			if list == nil {
				list = []string{}
			}

			kitsune.Respond(w, list)
			return
		}

		if strings.Contains(p, "/") {
			logs.Warning("Invalid filename.", p)
			neko.BadRequest(w)
			return
		}

		logs.Info("Get image.", p)
		f, err := os.Open(filepath.Join(DirImages, p))
		if err != nil {
			if os.IsNotExist(err) {
				logs.Warning("Not found.", p, err)
				neko.Teapot(w)
				return
			}

			logs.Error("Unknown error while downloading.", p, err)
			neko.InternalServerError(w)
			return
		}

		if _, err := io.Copy(w, f); err != nil {
			logs.Warning("Error while copying response.", err)
		}
	})
}

func ListImages(prefix string) (list []string, err error) {
	fs, err := os.ReadDir(DirImages)
	if err != nil {
		return
	}
	list = make([]string, 0, len(fs))
	for _, f := range fs {
		list = append(list, path.Join(prefix, f.Name()))
	}
	return
}
