#!/bin/bash

docker run --name datingapp.db --network="pgnetwork" -e "POSTGRES_PASSWORD=mysecretpassword" -v datingapp.db -p 5432:5432 -d postgres