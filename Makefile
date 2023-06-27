SOURCES := $(CURDIR)/sources

DOCKER_SCOPE := chiyoi
AZURE_CONTAINERS_GROUP := neko03

ARTIFACTS += services/nacho

.PHONY: all services/% services/%-deploy

all: $(ARTIFACTS);

services/%:
	docker build -t $(DOCKER_SCOPE)/$* $(SOURCES)/services/$*
	docker push $(DOCKER_SCOPE)/$*

services/%-deploy: services/%
	az containerapp update -g $(AZURE_CONTAINERS_GROUP) -n $* --yaml $(SOURCES)/services/$*/azure-container.yml
