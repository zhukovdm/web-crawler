#!/bin/bash

updateRecord() {
  curl \
    -v \
    -X PUT \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "http://www.example1.com/",
      "regexp": "*",
      "period": 1,
      "label": "Example website X",
      "active": 0,
      "tags": [ "a", "b" ]
    }' \
    http://127.0.0.1:3000/api/v1/records/$1
}

updateRecord "1"
updateRecord "5"
