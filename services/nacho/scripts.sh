#!/usr/bin/env sh
usage() {
    echo "scripts:"
    echo "./scripts.sh test_run"
    echo "    Run the main package locally."
    echo "./scripts.sh build"
    echo "    Build image and push to Docker Hub."
    echo "./scripts.sh deploy"
    echo "    Deploy container to Azure Container Apps from Docker Hub."
    echo "./scripts.sh update"
    echo "    Build and Deploy."
}

test_run() {
    go run ./main
}

build() {
    docker build -t $DOCKER_SCOPE/$ARTIFACT_NAME . || return
    docker push $DOCKER_SCOPE/$ARTIFACT_NAME
}

deploy() {
	az containerapp update -g $AZURE_CONTAINERS_GROUP -n $ARTIFACT_NAME --yaml azure-container.yml
}

update() {
    build && deploy
}

DOCKER_SCOPE=chiyoi
ARTIFACT_NAME=nacho
AZURE_CONTAINERS_GROUP=neko03_group

SCRIPTS="test_run build deploy update"

if test $# -ne 1 || test ! "$(echo $SCRIPTS | sed 's/ /\n/g' | grep -Ex "$1")"; then
usage
exit 1
fi

if test "$(echo "$1" | grep -Ex '\-{0,2}h(elp)?')"; then
usage
exit
fi

$1
