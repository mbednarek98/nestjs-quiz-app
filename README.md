<div align="center">
  <img src="https://github.com/mbednarek98/nestjs-quiz-app/blob/master/res/logo.png?raw=true" width="200" alt="Quiz Logo" />

  # Quiz

  
  <a href="" target="_blank"><img src="https://img.shields.io/badge/license-MIT-green" alt="Package License" /></a>
  <img src="https://dcbadge.vercel.app/api/shield/247463720337276929?style=flat" alt="Discord" />
</a>

A GraphQL-based backend for a quiz application, built using NestJS and TypeScript. This application leverages PostgreSQL for data storage and Docker for containerization.
</div>

## 📑 Table of Contents
1. [Prerequisites](#🔑-prerequisites)
2. [Installation](#⚙️-installation)
3. [Usage](#🚀-usage)
4. [Testing](#🧪-testing)
5. [Examples](#💡-examples)
6. [License](#📕-license)

## ✨ Features
- GraphQL API for quiz management.
- Support for various question types (single correct, multiple correct, sorting, plain text).
- Quiz scoring system.
- Single GraphQL mutation for quiz creation.

## 🔑 Prerequisites

Before you begin, ensure you have the following installed:
- Docker Desktop: [Download](https://www.docker.com/products/docker-desktop/)
- Node.js (v20+): [Download](https://nodejs.org/en/)
- NPM (included with Node.js): [Info](https://www.npmjs.com/)
- IDE: [Visual Studio Code](https://code.visualstudio.com/) or [VSCodium](https://vscodium.com/)

## ⚙️ Installation

### 1. Clone the Repository
First, clone the repository to your local machine:

```bash
$ git clone https://github.com/mbednarek98/nestjs-quiz-app.git

$ cd nestjs-quiz-app

$ code .            # Optional: Open in Visual Studio Code
```

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
$ npm install       # Installs all dependencies saved in package.json
```

### 3. Environment Configuration
Rename .env.example to .env and update the variables:
```bash
DB_HOST='localhost' 
DB_PORT='5432' 
DB_NAME='quiz-db' 
DB_USERNAME='postgres'
DB_PASSWORD='JacaPraca'
```

### 4. Docker compose
```bash
$ npm run db:dev:up    # Compiles and creates PostgreSQL container
```

### 5. Verifying Installation
Run the application:

```bash
$ npm run start        # Runs the application
```
Navigate to [GraphQL Playground](http://localhost:3333/graphql) and try out the queries [examples](#🔍-graphql-query-examples).


## 🚀 Usage
Run the application in different environments:


### Development Environment
For local development and debugging:

```bash
$ npm run start       # Runs the app in the development mode.
```
### Watch Mode
For real-time feedback on code changes:
```bash
$ npm run start:dev   # Restarts the server automatically upon file changes.
```
### Production Environment
For deploying the application in a production setting:
```bash
$ npm run start:prod  # Optimizes performance for production use.
```

## 🧪 Testing
```bash
$ npm run test        # Executes unit tests.
```

## 💡 Examples

### 🛠️ GraphQL Mutation Examples

####  CreateQuiz
<details>
<summary>Click to expand</summary>

<div align="center">

| Input | Output |
|-------|--------|
| <pre lang="graphql"><code>&#13;mutation {&#13;  createQuiz(input: &#13;    {title: "Simple knowledge test", &#13;      questions: [&#13;        {&#13;        description: "What is the capital of France?",&#13;        type: SingleCorrect,&#13;        answers: [{&#13;          name: "London",&#13;        },&#13;        {&#13;          name: "Paris",&#13;          is_correct: true,&#13;        },&#13;        {&#13;          name: "Rome",&#13;        },&#13;        {&#13;          name: "Madrid",&#13;        }]}],&#13;        description: "Which of the following programming languages are object-oriented?",&#13;        type: MultipleCorrect,&#13;        answers: [{&#13;          name: "Java",&#13;		  is_correct: true,&#13;        },&#13;        {&#13;          name: "C",&#13;        },&#13;        {&#13;          name: "Python",&#13;          is_correct: true,&#13;        },&#13;        {&#13;          name: "Ruby",&#13;          is_correct: true,&#13;        }]}],&#13;        description: "Arrange the following events in chronological order.",&#13;        type: Sorting,&#13;        answers: [{&#13;          name: "Declaration of Independence",&#13;          order: 1&#13;        },&#13;        {&#13;          name: "World War II",&#13;          order: 2&#13;        },&#13;        {&#13;          name: "First Moon Landing",&#13;          order: 3&#13;        }]}],&#13;        description: "What is the famous phrase from Star Wars?",&#13;        type: PlainText,&#13;        answers: [{&#13;          name: "May the Force be with you.",&#13;          is_correct: true&#13;        }]}&#13;      ] }) {&#13;    error&#13;    ok&#13;  }&#13;}&#13;</code></pre> | <pre lang="json"><code>{&#13;  "data": {&#13;    "createQuiz": {&#13;      "error": null,&#13;      "ok": true&#13;    }&#13;  }&#13;}</code></pre> |

</div>

</details>

### 🔍 GraphQL Query Examples

#### GetQuiz

<details>
<summary>Click to expand</summary>

<div align="center">

| Input | Output |
|-------|--------|
| <pre lang="graphql"><code>query {&#13;  getQuiz(title: "Simple knowledge test"){&#13;      title&#13;      description&#13;      questions{&#13;        number&#13;        description&#13;        type&#13;        answers{&#13;          name&#13;        }&#13;      }&#13;  }&#13;}</code></pre> | <pre lang="json"><code>{&#13;  "data": {&#13;    "getQuiz": {&#13;      "title": "Simple knowledge test2",&#13;      "description": "",&#13;      "questions": [&#13;        {&#13;          "number": 1,&#13;          "description": "What is the capital of France?",&#13;          "type": "SingleCorrect",&#13;          "answers": [ &#13;            {&#13;              "name": "London"&#13;            },&#13;            {&#13;              "name": "Paris"&#13;            },&#13;            {&#13;              "name": "Rome"&#13;            },&#13;            {&#13;              "name": "Madrid"&#13;            }&#13;          ]&#13;        },&#13;        {&#13;          "number": 2,&#13;          "description": "Which of the following programming languages are object-oriented?",&#13;          "type": "MultipleCorrect",&#13;          "answers": [ &#13;            {&#13;              "name": "Java"&#13;            },&#13;            {&#13;              "name": "C"&#13;            },&#13;            {&#13;              "name": "Python"&#13;            },&#13;            {&#13;              "name": "Ruby"&#13;            }&#13;          ]&#13;        },&#13;        {&#13;          "number": 3,&#13;          "description": "Arrange the following events in chronological order.",&#13;          "type": "Sorting",&#13;          "answers": [ &#13;            {&#13;              "name": "Declaration of Independence"&#13;            },&#13;            {&#13;              "name": "World War II"&#13;            },&#13;            {&#13;              "name": "First Moon Landing"&#13;            }&#13;          ]&#13;        },&#13;        {&#13;          "number": 4,&#13;          "description": "What is the famous phrase from Star Wars?",&#13;          "type": "PlainText",&#13;          "answers": [ &#13;            {&#13;              "name": ""&#13;            }&#13;          ]&#13;        }&#13;      ]&#13;    }&#13;  }&#13;}</code></pre> |

</div>

</details>


#### EvaluateQuizAnswers

<details>
<summary>Click to expand</summary>
<div align="center">

| Input | Output |
|-------|--------|
| <pre lang="graphql"><code>query{&#13;  evaluateQuizAnswers(input : {&#13;    title: "Simple knowledge test"&#13;    answers : [&#13;      {&#13;        questionNumber: 1&#13;        name: "Paris"&#13;      }&#13;      {&#13;        questionNumber: 2&#13;        name: "Java"&#13;      }&#13;      {&#13;        questionNumber: 2&#13;        name: "Python"&#13;      }&#13;      {&#13;        questionNumber: 2&#13;        name: "Ruby"&#13;      }&#13;      {&#13;        questionNumber: 3&#13;        name: "Declaration of Independence"&#13;        order: 1&#13;      }&#13;      {&#13;        questionNumber: 3&#13;        name: "World War II"&#13;        order: 2&#13;      }&#13;      {&#13;        questionNumber: 3&#13;        name: "First Moon Landing"&#13;        order: 3&#13;      }&#13;      {&#13;        questionNumber: 4&#13;        name:"maytheforcebewithyou"&#13;      }&#13;    ]&#13;  }){&#13;    totalPoints&#13;    earnedPoints&#13;  }&#13;}</code></pre> | <pre lang="json"><code>{&#13;  "data": {&#13;    "submitQuizAnswers": {&#13;      "totalPoints": 4,&#13;      "earnedPoints": 4&#13;    }&#13;  }&#13;}</code></pre> |

</div>

</details>


## 📕 License

This project is licensed under the [MIT license](LICENSE)
