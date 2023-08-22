#!/usr/bin/env sh
usage() {
    dirname $(realpath $0)
    echo "scripts:"
    echo "./scripts.sh run <platform> [options...]"
    echo "    Run the application locally."
    echo "    [options...]: options for expo."
    echo "./scripts.sh build <platform>"
    echo "    Export static page."
    echo "./scripts.sh deploy <platform>"
    echo "    Deploy the application."
    echo "    web: deploy to Static Web App."
    echo "    native: deploy to Expo App Service."
    echo "./scripts.sh update <platform>"
    echo "    Build and Deploy."
    echo
    echo "platform: (web|native)"
}

native=false

run() {
    export ENDPOINT_NACHO='http://booklet.local:7147/'
    shift
    npx expo start $@
}

build() {
    export ENDPOINT_NACHO='https://nacho.greentree-6daa7305.japaneast.azurecontainerapps.io/'

    if $native; then
    npx expo export -c -p ios
    else
    npx expo export -c -p web
    fi
}

deploy() {
    if $native; then
    eas update -p ios --branch=main --skip-bundler
    else
    swa deploy ./dist --env production
    fi
}

update() {
    build && deploy
}

if test -z "$1" -o -n "$(echo "$1" | grep -Ex '\-{0,2}h(elp)?')"; then
usage
exit
fi

case "$1" in
run|build|deploy|update)

case "$2" in
web)
export TAMAGUI_TARGET=web
;;
native)
native=true
export TAMAGUI_TARGET=native
;;
*)
usage
exit 1
esac

;;
*)
usage
exit 1
esac

$@
