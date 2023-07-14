deleteRecord() {
  curl \
    -v \
    -X DELETE \
    http://127.0.0.1:3000/api/v1/records/$1
}

deleteRecord "1"
deleteRecord "5"
