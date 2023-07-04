package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path"
	"strings"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/chiyoi/go/pkg/kitsune"
	"github.com/chiyoi/go/pkg/logs"
	"github.com/chiyoi/go/pkg/neko"
	"github.com/chiyoi/neko03/sources/services/nacho/config"
)

func ListImageHandler(refPrefix string, blob *azblob.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		logs.Info("list images")
		imageList := []string{}
		pager := blob.NewListBlobsFlatPager(config.NameBlobContainerNachoImages, nil)
		for pager.More() {
			ctx, cancel := context.WithTimeout(context.Background(), config.Timeout)
			defer cancel()
			resp, err := pager.NextPage(ctx)
			if err != nil {
				logs.Error(err)
				neko.InternalServerError(w, err.Error())
				return
			}

			for _, item := range resp.Segment.BlobItems {
				imageList = append(imageList, path.Join(refPrefix, *item.Name))
			}
		}

		kitsune.Respond(w, imageList)
	})
}

func GetImagePatternHandler(pattern string, blob *azblob.Client) (string, http.Handler) {
	return pattern, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		filename := neko.TrimPattern(r.URL.Path, pattern)
		if strings.Contains(filename, "/") {
			message := "invalid file name"
			logs.Warning(fmt.Sprintf("%s: %s", filename, message))
			neko.BadRequest(w, message)
			return
		}

		logs.Info(fmt.Sprintf("get image (%s)", filename))
		resp, err := blob.DownloadStream(context.Background(), config.NameBlobContainerNachoImages, filename, nil)
		if err != nil {
			var re *azcore.ResponseError
			if errors.As(err, &re) && re.StatusCode == http.StatusNotFound {
				message := "なちょ逃げた"
				logs.Warning(logs.Cat(message, fmt.Sprintf("not found (%s)", filename)))
				neko.Teapot(w, message)
				return
			}

			logs.Error(err)
			neko.InternalServerError(w, err.Error())
			return
		}

		if _, err := io.Copy(w, resp.Body); err != nil {
			logs.Warning(err)
		}
	})
}
