#!/usr/bin/env bash

kubectl delete -f ./service.yaml

kubectl delete -f ./deployment.yaml

kubectl delete -f ./secret.yaml