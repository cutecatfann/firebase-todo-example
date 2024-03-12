# SOU CS 333 Backend API

This API was created with Node, ExpressJS and MongoDB. 

## Setup

### Node Version

Ensure that you are running Node v20.10.0

### .env File

Create a `.env` file in the root of the project that contains the following:

```
PORT: 3000
NODE_ENV: development
DB_CONNECT: mongodb://localhost:27017/cs333
```
### MongoDB

On your local Mongo instance, create a new database named 'cs333'. It can be empty when you first start the server. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app.\
It will report that it's running on port 3000 and which environment (production or development) that it's running in.
The server will also report whether it has connected to the MongoDB database. 

### `npm run dev`

Does everything in the above script, but runs the server using `nodemon`. The server will automatically restart when it 
detects a change to the code. 

