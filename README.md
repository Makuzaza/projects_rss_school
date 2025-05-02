## Fun Chat

An interactive chat application developed as part of the RSSchool JS/FE course. Fun Chat provides users with a platform to engage in real-time communication through text messages. 

## Key Features:

- User Authentication Page
- Main Page
  - User List
  - User Dialogue
  - Messages include the time of sending, sender's username, message delivery status, message text, and indication of whether the message has been edited. A user can edit or remove his message.
- About Page

## Technology stack

- Language: [**TypeScript**](https://www.typescriptlang.org/)
- Builder: [**Webpack**](https://webpack.js.org/)
- Linters: [**ESLint**](https://eslint.org/), [**Prettier**](https://prettier.io/)
- Pre-push/Pre-commit: [**Husky**](https://typicode.github.io/husky/)

## Setup and Running Server Application for the Chat. API

**To test the app functionality, please clone [server application](https://github.com/rolling-scopes-school/fun-chat-server/tree/main) and keep the server running during functionality review.**

To use the chat server application follow these steps:

- clone the repository
- install the dependencies with npm i
- create the .env file and specify the port settings and server event log settings in it
- start the local server using npm run start
- The server runs on port 4000 and listens for messages from client applications.