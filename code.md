# How to Build Firebase Auth into Todo App
## Mimi Pieper

## Firebase Setup
1. Go to [firebase](https://console.firebase.google.com/u/0/)
    - You may need to sign up for a Google Account
2. Create a new project, choose a Name and a Unique identifier. These aren't important, choose what you want that is mildly descriptive
3. When asked disable Google Analytics for the project
4. When the project is set up, add web app by clicking the `<\>` button on the screen
5. Don't select hosting unless you want to try it out. I've done Firebase hosting before and it does work well, but that is beyond scope
6. Click use NPM, it should show up with something similar to the below firebase config

    ```javascript
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "XXX",
    authDomain: "XXX.firebaseapp.com",
    projectId: "XXX",
    storageBucket: "XXX.appspot.com",
    messagingSenderId: "XXX",
    appId: "XXX"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    ```
7. Now, in project root run `npm install firebase`
8. On the app homepage click add authentication then click get started
9. On the authentication options page select Google. You can select more if you want
10. Go into the page and click on the toggle to turn it on
11. Add support email
12. Click Save
13. Go to project Settings -> Service Accounts
14. Generate new private key
15. Save the JSON in your backend directory

## Backend Setup and Code
First, we are going to set up the backend to support firebase auth. This includes quite a few big changes, so buckle up!

First of all, we are going to support a method for authentication on the backend. The backend will be reciving tokens with headers that include the authorization.

**models/user.js**\
This will support the user object in the backend. This is needed to support sign in sessions and persistant sign in
```javascript
import mongoose from 'mongoose'

let UserSchema = new mongoose.Schema({
  // User's unique identifier from Firebase
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
}, {
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
})

export const User = mongoose.model('User', UserSchema)

```

**config/authenticate.js**\
Here, it supports all the backend authentication. It creates a new user in the database, or updates the user. If there are any errors, it responds with an error code. It also decodes the header token from firebase.
```javascript
// Importing the admin module from firebase-admin
import admin from 'firebase-admin'
// Importing the User model from the models directory
import { User } from '../models/user.js'

// Exporting an asynchronous function named authenticate
export const authenticate = async (req, res, next) => {
  // Extracting the authorization token from the request headers
  const token = req.headers.authorization
  try {
    // Verifying the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token)
    // Finding a user in the database with the uid from the decoded token
    let user = await User.findOne({ uid: decodedToken.uid })
    // If the user doesn't exist in the database
    if (!user) {
      // Create a new user with the uid, email, and name from the decoded token
      user = await User.create({ uid: decodedToken.uid, email: decodedToken.email, name: decodedToken.name })
    }
    // Assigning the user object to the request object
    req.user = user
    // Calling the next middleware in the stack
    next()
  } catch (error) {
    // If an error occurs, send a 401 Unauthorized status code with a message
    res.status(401).send({ message: 'Unauthorized' })
  }
}
```

**index.js**\
Your serviceAccountKey will connect this app on the backend to Firebase. As such, the backend will open it, scan it, and give itself admin credentials. 

Once it has admin credentials you can do fun stuff like logging people in and out
```javascript
import admin from 'firebase-admin' 
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8')) // REPLACE WITH YOUR JSON FILE NAME

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
```

## Frontend Setup and Code
**src/Login.jsx**\
This component handles the login process by intializing a google pop up window that returns a Google Access Token which you can then use to send to the backend for authentication.
```javascript
import React from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase' // import auth from your firebase.js file

const Login = () => {
  const signInWithGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  return (
    <button onClick={signInWithGoogle} className="google-login-btn">Sign in with Google</button>
  )
}

export default Login
```

**src/firebase.js**\
Here, put the code you copied from the Firebase web console for your app. It will connect to Firebase via this. Note that it is not the most secure! 

Other ways than a static JS file in the frontend would be much more secure.
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "XXX",
authDomain: "XXX.firebaseapp.com",
projectId: "XXX",
storageBucket: "XXX.appspot.com",
messagingSenderId: "XXX",
appId: "XXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

**src/App.jsx**\
This is the main App for all the code. It handles waiting for the app to load, calling the login, then calling the todos. It also allows for logout.
```javascript
// Importing necessary hooks and functions from react and firebase
import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from './components/firebase' 
import Todos from './components/Todos/Todos'
import Login from './components/Login'

/**
 * The main component of the application.
 * Renders the Todos component inside a div with the class name 'app'.
 *
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  // State variables for user and loading status
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect hook to handle user authentication state changes
  useEffect(() => {
    // Subscribe to auth state changes and set the user state variable
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)
    })
    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe()
  }, [])

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Attempt to sign out the user
      await signOut(auth);
    } catch (error) {
      // Log any errors that occur during sign out
      console.error('Error signing out', error);
    }
  };
  
  // If the app is still loading (i.e., we're still checking the user's auth state), show a loading message
  if (loading) {
    return <div>Loading...</div>
  }

  // Render the main app UI
  return (
    <div className='app'>
      <section className='todos'>
        <header>
          <h1>To-Do List</h1>
          {/* If the user is logged in, show a logout button */}
          {user && <button onClick={handleLogout}className="google-login-btn">Logout</button>}
        </header>
        {/* If the user is logged in, welcome them and show the Todos component. Otherwise, show the Login component. */}
        <h5>{user ? `Welcome, ${user.displayName}` : ''}</h5>
        {user ? <Todos user={user} /> : <Login />}
      </section>
    </div>
  )
}

export default App

```

**Todos.jsx**\
```javascript
import { getAuth, getIdToken } from 'firebase/auth';
...

const fetchData ...
    const response = await fetch('http://localhost:3000', {
            headers: {
            'Authorization': token,
            },
        })

handleCreate ...
    await fetch("http://localhost:3000", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': token,
        },
        body: JSON.stringify(newTodo),
      });

```

**src/index.css**\
Here is some basic styling for the buttons to make it look a bit better
```css
/* Google Login Button */
.google-login-btn {
  display: flex;
  justify-content: center; /* align text to the center */
  align-items: center;
  width: fit-content; 
  background-color: #4285F4;
  color: white;
  padding: 0.5em 1em;
  cursor: pointer;
  border: none;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.google-login-btn:hover {
  background-color: #2B7DE9;
}

.google-login-btn img {
  width: 20px;
  height: 20px;
}
```

## Running It!
Either host it on a server or run locally

### Local:
1. Open a mongodb shell on your machine and type `use cs333`
2. Open a terminal, `cd` into the backend, and run `npm install` 
3. Open a terminal, `cd` into the frontend, run `npm install`
4. Go back to the terminal with the backend code, run `npm run dev`
5. Open the frontend terminal without closing the backend terminal and run `npm start`. Select `yes` for using another port
