#!/bin/bash

createExe() {

  curl \
    -v \
    -H "Content-Type: application/json" \
    -d "{
      \"recId\": $1
    }" \
    http://localhost:3001/api/v1/executions
}

createExe "1"
