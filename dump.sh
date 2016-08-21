## real
mongodump --port 9000 -o real_dump

## dev
mongodump
mongorestore
mongorestore real_dump
