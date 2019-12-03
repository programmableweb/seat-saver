#!/usr/bin/env bash

kubectl apply -f ./secret.yaml

sleep 5

kubectl apply -f ./deployment.yaml

sleep 5

kubectl apply -f ./service.yaml