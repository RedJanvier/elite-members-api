# elite-members-api

[![DeepScan grade](https://deepscan.io/api/teams/6051/projects/7911/branches/87930/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6051&pid=7911&bid=87930)
[![Build Status](https://travis-ci.org/RedJanvier/elite-members-api.svg?branch=develop)](https://travis-ci.org/RedJanvier/elite-members-api)
[![Coverage Status](https://coveralls.io/repos/github/RedJanvier/elite-members-api/badge.svg?branch=develop)](https://coveralls.io/github/RedJanvier/elite-members-api?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/codeclimate/codeclimate/maintainability)

This is a REST API based on Node Js, Express, Postgresql, and JWT for authentication which deals with managing and maintaining members of a class group called Elite.

## Features to implement

- Member should be able to Join the group
- Member should be able to leave the group
- Member should be able to update his/her informations
- Anyone should be able to get all details of any member
- Anyone should be able so see all members of the group
- Member (committee) should be able to log into his/her group account

## Routes

- See all members

```
[GET] /api/v2/members/

:body: none
```

- See a single member

```
[GET] /api/v2/members/:id

:body: none
```

- Signin a members

```
[POST] /api/v2/members/signin

:body: {
    email "STRING",
    password "STRING"
}
```

- Create a members (require signin)

```
[POST] /api/v2/members/create

:body: {
    name "STRING",
    email "STRING",
    shares "INTEGER",
    location "STRING",
    img "URL",
    committee "STRING" (optional),
    password "STRING"
}
```

- Edit a member (require signin)

```
[PATCH] /api/v2/members/:id

:body: (updates_only) {
    name "STRING",
    email "STRING",
    shares "INTEGER",
    location "STRING",
    img "URL",
    committee "STRING" (optional),
    password "STRING"
}
```

- Remove a members

```
[DELETE] /api/v2/members/:id

:body: none
```

## Tech stack

- Node JS
- Express JS
- PostgreSQL
- knex
- bcrypt
- jsonwebtokens

## Author

**RedJanvier**

### Contacts

[Github](https://github.com/RedJanvier)
[Twitter](https://twitter.com/red_janvier)
[YouTube](https://www.youtube.com/channel/UCrQBNajZa-ibHBerJQ0kAiQ)
[Facebook](https://facebook.com/jan.h.red)
