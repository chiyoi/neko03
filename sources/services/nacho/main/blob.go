package main

import (
	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/chiyoi/neko03/sources/services/nacho/config"
)

func BlobClient(endpoint string) (client *azblob.Client, err error) {
	credential, err := credential()
	if err != nil {
		return
	}

	return azblob.NewClient(endpoint, credential, nil)
}

func credential() (credential azcore.TokenCredential, err error) {
	if config.IsProd() {
		return azidentity.NewManagedIdentityCredential(nil)
	}
	return azidentity.NewAzureCLICredential(nil)
}
