#!/bin/bash

# get all records

curl \
  -v \
  -H 'Content-Type: application/json' \
  http://127.0.0.1:3000/api/v1/records

# create new record

curl \
  -v \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "http://www.example.com/",
    "label": "Example website",
    "active": true,
    "period": 10,
    "regexp": "*",
    "tags": [ "first", "test", "example" ]
  }' \
  http://127.0.0.1:3000/api/v1/records
