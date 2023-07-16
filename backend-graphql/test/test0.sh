#!/bin/bash

createExecution() {
  curl \
    -v \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{
      "recId": 1
    }' \
    http://127.0.0.1:3000/api/v1/executions/
}

for i in {1..3}
do
  createExecution
done
