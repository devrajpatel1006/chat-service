# Chat Service

Chat Service

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/devrajpatel1006/chat-service.git
   ```

## Features

- **Real-time Chat:** Users can log in, select groups, and engage in real-time chat.
- **Socket Implementation:** Implemented socket for efficient real-time communication.

## Technologies Used

List the technologies and frameworks used in your project. For example:

- Frontend: Ejs
- Backend: Node.js
- Database: MongoDB
- WebSocket: Socket.IO

## Testing

Chai and Axios are popular choices for E2E testing. Mocha as the test framework. Chai helps you make assertions about your application's behavior, and Axios allows you to interact with APIs and make HTTP requests during your tests.

- Mocha: Test framework
- Chai: Assertions
- Axios: HTTP requests

```bash
  npm install mocha chai axios --save-dev
```

Run test cases
```bash
  npm run test:all
```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. We've developed a frontend that enables users to log in, select groups, and engage in real-time chat. I implemented socket technology for this functionality.

```bash
   Access frontend using http://localhost:8082
```

## Configuration

1.  Create a .env file in the root directory and add your configuration:

```
MONGO_URI=  "mongodb://localhost:27017/your-database?retryWrites=true&w=majority"
JWT_SECRET =  "your-secret-key-here"
PORT=8082
COOKIE_Expire_TIME=  1800000
API_BASE_URL="http://localhost:8082"



```

## API Documentation

1. API documentation is generated using Swagger. Access the Swagger UI at:

   ```
   http://localhost:8082/api-docs

   ```
 
