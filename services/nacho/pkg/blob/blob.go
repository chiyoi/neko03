package blob

import (
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

var (
	EndpointAzureBlob = os.Getenv("ENDPOINT_AZURE_BLOB")
	IsProd            = os.Getenv("ENV") == "prod"
)

func Client() (c *azblob.Client, err error) {
	cred, err := credential()
	if err != nil {
		return
	}
	return azblob.NewClient(EndpointAzureBlob, cred, nil)
}

func credential() (azcore.TokenCredential, error) {
	if IsProd {
		return azidentity.NewManagedIdentityCredential(nil)
	}
	return azidentity.NewAzureCLICredential(nil)
}
