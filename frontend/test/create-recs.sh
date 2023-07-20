#!/bin/bash

createRecs() {

  curl \
    -v \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "http://www.example.com/1",
      "regexp": ".*",
      "period": 5,
      "label": "Example web 1",
      "active": false,
      "tags": [ "a", "b" ]
    }' \
    http://127.0.0.1:3001/api/v1/records

  curl \
    -v \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "http://www.example.com/2",
      "regexp": ".*",
      "period": 5,
      "label": "Example web 2",
      "active": false,
      "tags": [ "b", "c" ]
    }' \
    http://127.0.0.1:3001/api/v1/records

  curl \
    -v \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "http://www.example.com/3",
      "regexp": ".*",
      "period": 5,
      "label": "Example web 3",
      "active": false,
      "tags": [ "c", "d" ]
    }' \
    http://127.0.0.1:3001/api/v1/records
}

createRecs
