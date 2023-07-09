#!/bin/bash

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
      "tags": [ "a", "b", "c" ]
    }' \
    http://127.0.0.1:3000/api/v1/records
}

createRecord
