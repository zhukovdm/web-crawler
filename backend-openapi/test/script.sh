#!/bin/bash

getAllRecords() {
  curl \
    -v \
    -H 'Content-Type: application/json' \
    http://127.0.0.1:3000/api/v1/records
}

createRecord() {
  curl \
    -v \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "http://www.example.com/",
      "regexp": "*",
      "period": 4,
      "label": "Example website",
      "active": 0,
      "tags": [ "first", "test", "example" ]
    }' \
    http://127.0.0.1:3000/api/v1/records
}

# getAllRecords
createRecord
