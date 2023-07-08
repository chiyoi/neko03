package image

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/chiyoi/go/pkg/kitsune"
	"github.com/chiyoi/go/pkg/logs"
	"github.com/chiyoi/go/pkg/neko"
	"github.com/chiyoi/neko03/sources/services/nacho/pkg/blob"
)

const (
	BlobContainerNachoImages = "neko03-nacho-images"
	TimeoutBlobQuery         = time.Second * 5
)

func PatternHandler(pattern string) (string, http.Handler) {
	if neko.IsWideCast(pattern) {
		logs.Panic(neko.ErrWideCastPatternNeeded)
	}

	c, err := blob.Client()
	if err != nil {
		logs.Panic(err)
	}

	return pattern, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sub := neko.TrimPattern(r.URL.Path, pattern)
		if sub == "list.json" {
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

		if strings.Contains(sub, "/") {
			msg := fmt.Sprintf("Invalid filename (%s).", sub)
			logs.Warning(msg)
			neko.BadRequest(w, msg)
			return
		}

		logs.Info("(Get image.)", sub)
		resp, err := c.DownloadStream(context.Background(), BlobContainerNachoImages, sub, nil)
		if err != nil {
			var re *azcore.ResponseError
			if errors.As(err, &re) && re.StatusCode == http.StatusNotFound {
				logs.Warning("(Not found.)", sub, err)
				kitsune.Teapot(w, nil)
				return
			}

			logs.Error(sub, err)
			kitsune.InternalServerError(w, nil)
			return
		}

		if _, err := io.Copy(w, resp.Body); err != nil {
			logs.Warning(err)
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
