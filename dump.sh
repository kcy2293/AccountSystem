## real
mongodump --port 9000 -o real_dump

## dev
mongodump
mongorestore
mongorestore real_dump

## windows
e:\dev\MongoDB\Server\3.2\bin\mongorestore.exe -h localhost e:\dev\AccountSystem\real_dump
