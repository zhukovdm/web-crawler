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
      "url": "http://www.example4.com/",
      "regexp": "*",
      "period": 4,
      "label": "Example website X",
      "active": 0,
      "tags": [ "first", "test", "example" ]
    }' \
    http://127.0.0.1:3000/api/v1/records
}

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

deleteRecord() {
  curl \
    -v \
    -X DELETE \
    http://127.0.0.1:3000/api/v1/records/$1
}

getAllRecords
createRecord
updateRecord "1"
updateRecord "5"
deleteRecord "1"
deleteRecord "5"
