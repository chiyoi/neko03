package config

import (
	"os"
	"time"
)

const (
	EndpointAzureBlob = "https://neko03storage.blob.core.windows.net/"
)

var (
	NameBlobContainerNachoImages = "neko03-nacho-images"
)

var (
	Timeout = time.Second * 20
	Addr    = func() string {
		if IsProd() {
			return ":http"
		}
		return ":7147"
	}
)

func IsProd() bool {
	return os.Getenv("ENV") == "prod"
}
