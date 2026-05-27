



## Auth

POST:- /api/login
GET:-  /api/logout
POST:- /api/signin

## Profile

GET:- profile/userData
PATCH:- profile/updateUser
PATCH:- profile/resetPassword

## Connections

POST:- request/send/:interested/:id
POST: request/send/:ignore/:id
    :- request/review/rejectedd/:id
    :- request/review/accepted/:id


## userRouter

GET:- user/Connection
GET:- user/request
GET:- user/feed 

$eq
$gt -greater
$gte -greater equal
$in:- inside
$nin: not inside
$ne: not in
$lt: less
$lte: less then equal
