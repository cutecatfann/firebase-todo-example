# firebase-todo-example
## Mimi Pieper

### What is this?
This is Firebase authentication for a basic MERN todo app. It uses Google Firebase in order to enable Google authentication and log in before people can visit the todo app. 

### What I did
In the backend I created a user model as a MongoDB database to store the user information. It stores the unique Firebase auth token, the user's name, and data about the session.

I also added a middleware piece that parses the authentication tokens in the headers that come as requests from the frontend. The middleware checks if the user has an appropriate auth token, if so, it checks if the user is in the MongoDB backend and adds if not, or updates if the user is already in there.

In the frontend I created a Login component that provides the user with a login screen, and gives them a pop-up Google authentication and sign in window. 

I created a Firebase component that holds the keys to connect to the Firebase app and account in order to process the logins.

I also added the auth tokens to each of the todo files within Todo/ that allows users to do all regular functiionality.

### How to run
1. Start Mongodb (if not running in background)
2. Open two terminals
3. In one terminal, cd into frontend
4. In the other terminal cd into backend 
5. Run `npm install` in both terminals
6. Then, for backend, run `npm run dev`
7. For frontend run `npm start`
