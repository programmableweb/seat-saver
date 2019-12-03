#!/usr/bin/env bash

#Create the local repo
docker run -d -p 5000:5000 --restart=always --name registry registry:2

#Create the seat-saver image
docker build -t seatsaver .

docker tag seatsaver localhost:5000/seatsaver:beta

docker push localhost:5000/seatsaver:beta

  #List the images in the registry

curl http://localhost:5000/v2/_catalog