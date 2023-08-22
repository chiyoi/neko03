#!/usr/bin/env sh
usage() {
    dirname $(realpath $0)
    echo "scripts:"
    echo "./scripts.sh run (web|native) [options...]"
    echo "    Run the application locally."
    echo "    [options...]: options for expo."
    echo "./scripts.sh deploy (web|native)"
    echo "    Deploy the application."
    echo "    web: deploy to Static Web App."
    echo "    native: deploy to Expo App Service."
}

run() {
    export ENDPOINT_NACHO='http://booklet.local:7147/'

    case "$1" in
    web)
    export TAMAGUI_TARGET=web
    ;;
    native)
    export TAMAGUI_TARGET=native
    ;;
    *)
    usage
    return 1
    esac

    shift
    npx expo start $@
}

deploy() {
    export ENDPOINT_NACHO='https://nacho.greentree-6daa7305.japaneast.azurecontainerapps.io/'

    case "$1" in
    web)
    export TAMAGUI_TARGET=web
    expo export -c -p web && swa deploy ./dist --env production
    ;;
    native)
    export TAMAGUI_TARGET=native
    expo export -c -p ios && eas update -p ios --branch=main --skip-bundler
    ;;
    *)
    usage
    return 1
    esac
}

if test -z "$1" -o -n "$(echo "$1" | grep -Ex '\-{0,2}h(elp)?')"; then
usage
exit
fi

case "$1" in
run|deploy)
;;
*)
usage
exit 1
esac

$@
