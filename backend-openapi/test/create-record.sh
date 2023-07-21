#!/bin/bash

createRecord() {
  curl \
    -v \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "https://www.csun.edu/~sk36711/WWW/tutorials/",
      "regexp": "^https://www.csun.edu/~sk36711/WWW/tutorials/",
      "period": 5,
      "label": "Digital Humanities Tutorials",
      "active": false,
      "tags": [ "digital", "humanities", "tutorials" ]
    }' \
    http://127.0.0.1:3001/api/v1/records
}

createRecord
