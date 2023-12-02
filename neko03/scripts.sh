#!/bin/zsh
scripts=$0
cd $(dirname $(realpath $scripts)) || return
usage () {
    pwd
    echo "Scripts:"
    echo "$scripts yarn"
    echo "    Yarn!"
    echo "$scripts dev"
    echo "    Run dev server locally."
}

dev () {
    next dev
}

case "$1" in
""|help|-h|-help|--help)
usage
exit
;;
yarn|dev) ;;
*)
usage
exit 1
;;
esac

$@

