#!/bin/bash

setup() {
    yarn
    docker compose -f docker/docker-compose.yml up -d
    sleep 1
    npx prisma migrate dev
}

cleanup() {
    docker compose -f docker/docker-compose.yml down
}

test() {
    npx jest --runInBand --coverage src
}

trap cleanup EXIT
setup
test
cleanup
