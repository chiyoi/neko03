package api

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"testing"

	"github.com/chiyoi/apricot/test"
)

func TestHandler(t *testing.T) {
	h := Handler()
	var w test.ResponseBuffer

	h.ServeHTTP(&w, &http.Request{
		Method: http.MethodGet,
		URL: &url.URL{
			Scheme: "https",
			Host:   "nacho.neko03.moe",
			Path:   "/images/IMG_3382.JPG",
		},
	})

	fmt.Println(w.StatusCode)
	fmt.Println(w.Header())
	f, err := os.Create("/Users/chiyoi/Desktop/t.png")
	if err != nil {
		t.Fatal(err)
	}
	io.Copy(f, &w.Body)
}
