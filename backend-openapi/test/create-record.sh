#!/bin/bash

createRecord() {
  curl \
    -v \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "http://www.example.com/1",
      "regexp": ".*",
      "period": 3,
      "label": "Example website",
      "active": false,
      "tags": [ "a", "b", "c" ]
    }' \
    http://127.0.0.1:3000/api/v1/records
}

createRecord
