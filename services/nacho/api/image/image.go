package image

import (
	"context"
	"errors"
	"io"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/chiyoi/apricot/kitsune"
	"github.com/chiyoi/apricot/logs"
	"github.com/chiyoi/apricot/neko"
	"github.com/chiyoi/neko03/services/nacho/blob"
)

const (
	BlobContainerNachoImages = "neko03-nacho-images"
	TimeoutBlobQuery         = time.Second * 25
)

// PatternHandler:
// GET /list.json
// GET /<filename>
func PatternHandler(pattern string) (string, http.Handler) {
	if !neko.IsWildcard(pattern) {
		logs.Panic(neko.ErrWildcardPatternNeeded)
	}

	c, err := blob.Client()
	if err != nil {
		logs.Panic(err)
	}

	return pattern, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			logs.Warning("Method not allowed.", r.Method)
			neko.MethodNotAllowed(w, "")
			return
		}

		p := neko.TrimPattern(r.URL.Path, pattern)
		if p == "list.json" {
			list, err := ListImages(pattern, c)
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
			neko.BadRequest(w, "Invalid filename.")
			return
		}

		logs.Info("Get image.", p)
		resp, err := c.DownloadStream(context.Background(), BlobContainerNachoImages, p, nil)
		if err != nil {
			var re *azcore.ResponseError
			if errors.As(err, &re) && re.StatusCode == http.StatusNotFound {
				logs.Warning("Not found.", p, err)
				neko.Teapot(w, "")
				return
			}

			logs.Error("Unknown error while downloading.", p, err)
			neko.InternalServerError(w, "")
			return
		}

		if _, err := io.Copy(w, resp.Body); err != nil {
			logs.Warning("Error while copying response.", err)
		}
	})
}

func ListImages(prefix string, c *azblob.Client) (list []string, err error) {
	pager := c.NewListBlobsFlatPager(BlobContainerNachoImages, nil)
	for pager.More() {
		ctx, cancel := context.WithTimeout(context.Background(), TimeoutBlobQuery)
		defer cancel()
		resp, err := pager.NextPage(ctx)
		if err != nil {
			return nil, err
		}

		for _, item := range resp.Segment.BlobItems {
			list = append(list, path.Join(prefix, *item.Name))
		}
	}
	return
}
