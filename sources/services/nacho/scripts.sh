#!/usr/bin/env sh
usage() {
    echo "scripts:"
    echo "./scripts.sh test-run"
}

if test $# -ne 1; then
usage
exit 1
fi

if test "$(echo "$1" | grep -Ex '\-{0,2}h(elp)?')"; then
usage
exit
fi

if test "$1" = "test-run"; then
go run ./main
fi

DOCKER_SCOPE=chiyoi
ARTIFACT_NAME=nacho

if test $1 = "build"; then
docker build -t $DOCKER_SCOPE/$ARTIFACT_NAME . || exit
docker push $DOCKER_SCOPE/$ARTIFACT_NAME
exit
fi

AZURE_CONTAINERS_GROUP=neko03_group

if test $1 = "deploy"; then
	az containerapp update -g $AZURE_CONTAINERS_GROUP -n $ARTIFACT_NAME --yaml azure-container.yml
fi