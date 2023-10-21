#!/bin/sh
cd $(dirname $(realpath $0))
usage() {
    pwd
    echo "scripts:"
    echo "$0 run <platform> [options...]"
    echo "    Run the application locally."
    echo "    [options...]: options for expo."
    echo "$0 build <platform>"
    echo "    Export static page."
    echo "$0 deploy <platform>"
    echo "    Deploy the application."
    echo "    web: deploy to Static Web App."
    echo "    native: deploy to Expo App Service."
    echo "$0 update <platform>"
    echo "    Build and Deploy."
    echo
    echo "platform: (web|native)"
}

native=false

common_env() {
    export VERSION='v0.1.1'
}

dev_env() {
    common_env
    export ENDPOINT_NACHO='http://booklet.local:7147/'
}

prod_env() {
    common_env
    export ENDPOINT_NACHO='https://nacho.greentree-6daa7305.japaneast.azurecontainerapps.io/'
}

run() {
    dev_env
    shift
    npx expo start $@
}

build() {
    prod_env
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
