## Description

Sigma Study Center WebApp

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

# Sigma Study Center API Documentation


### Create User (POST)
Create a new user.

**Endpoint:**
**POST http://localhost:3000/api/v1/quiz/create**

Request Body (JSON):
```json
{
    "name": "sid 2",
    "email": "sid22@gmail.com"
}
```

### Create Multiple-Choice Quiz (POST)
Create a multiple-choice quiz.

**POST http://localhost:3000/api/v1/quiz/quiz**
Request Body (JSON):

```json
{
    "heading": "Sample Quiz 2",
    "description": "This is a sample quiz for testing purposes.",
    "type": "mcq",
    "mcqOptions": {
        "a": "Option A",
        "b": "Option B",
        "c": "Option C",
        "d": "Option D"
    },
    "email": "sid22@gmail.com"
}

```
**Create Text-Based Quiz (POST)**
Create a text-based quiz.

**POST http://localhost:3000/api/v1/quiz/quiz**
Request Body (JSON):


```json
{
    "heading": "Sample Quiz 2",
    "description": "This is a sample quiz for testing purposes. 2",
    "type": "text",
    "textOption": {
        "text": "what is an icecream?"
    },
    "email": "sid22@gmail.com"
}
```


**Submit Quiz Answer (POST)**
Submit a user's answer to a quiz.


**POST http://localhost:3000/api/v1/quiz/answer**
Request Body (JSON):


```json 
{
    "submission": "User's answer goes here",
    "quizId": 5,
    "userId": 1
}
```


## Support

zubblehq@gmail.com

## Stay in touch

- Website - zubble.co
