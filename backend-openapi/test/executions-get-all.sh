#!/bin/bash

getAllExecutions() {
  curl \
    -v \
    -H 'Content-Type: application/json' \
    http://127.0.0.1:3000/api/v1/executions
}

getAllExecutions
