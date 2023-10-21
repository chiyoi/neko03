package app

import (
	"crypto/md5"
	"io"
	"net/http"
	"net/url"
	"os"
	"testing"

	"github.com/chiyoi/apricot/test"
)

var tcs = []struct {
	in  *http.Request
	out ResponseDigest
}{
	{
		&http.Request{
			Method: http.MethodGet,
			URL: &url.URL{
				Path: "/image/IMG_3382.JPG",
			},
		},
		ResponseDigest{
			BodyMD5: func() [md5.Size]byte {
				f, err := os.Open("../files/images/IMG_3382.JPG")
				if err != nil {
					panic(err)
				}

				d := md5.New()
				if _, err := io.Copy(d, f); err != nil {
					panic(err)
				}

				return [16]byte(d.Sum(nil))
			}(),
		},
	},
	{
		&http.Request{
			Method: http.MethodGet,
			URL: &url.URL{
				Path: "/nyan",
			},
		},
		ResponseDigest{
			StatusCode: 418,
		},
	},
}

func TestHandler(t *testing.T) {
	if err := os.Chdir(".."); err != nil {
		t.Fatal(err)
	}

	h := RootHandler()
	for i, tc := range tcs {
		var w test.ResponseBuffer
		h.ServeHTTP(&w, tc.in)
		if tc.out.StatusCode != 0 {
			if w.StatusCode != tc.out.StatusCode {
				t.Errorf("test case %v StatusCode: %v (expect %v).", i, w.StatusCode, tc.out.StatusCode)
			}
		}

		if tc.out.BodyMD5 != [md5.Size]byte{} {
			d := md5.New()
			if _, err := io.Copy(d, &w.Body); err != nil {
				t.Fatal(err)
			}
			if di := [md5.Size]byte(d.Sum(nil)); di != tc.out.BodyMD5 {
				t.Errorf("test case %v BodyDigest: %v (expect %v).", i, di, tc.out.BodyMD5)
			}
		}
	}
}

type ResponseDigest struct {
	StatusCode int
	BodyMD5    [md5.Size]byte
}
