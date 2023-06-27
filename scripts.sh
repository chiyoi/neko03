usage() {
    echo "usage: scripts.sh <action> <artifact>"
    echo "actions: test-run build deploy"
    echo "artifacts: $ARTIFACTS"
}

SOURCES=$(dirname $(realpath))/sources
ARTIFACTS+="services/nacho "

if test $(echo $1 | grep -Ex '\-{0,2}h(elp)?'); then
usage
exit
fi

if test $1 = "test"; then
echo "Nyan~"
exit
fi

if test $# -ne 2; then
usage
exit 1
fi

if test $1 = "test-run"; then
go run $SOURCES/$2
exit
fi

DOCKER_SCOPE=chiyoi
ARTIFACT_NAME=$(echo $2 | sed "s;services/;;")

if test $1 = "build"; then
docker build -t $DOCKER_SCOPE/$ARTIFACT_NAME $SOURCES/$2 || exit
docker push $DOCKER_SCOPE/$ARTIFACT_NAME
exit
fi

AZURE_CONTAINERS_GROUP=neko03

if test $1 = "deploy"; then
	az containerapp update -g $AZURE_CONTAINERS_GROUP -n $ARTIFACT_NAME --yaml $SOURCES/$2/azure-container.yml
fi
