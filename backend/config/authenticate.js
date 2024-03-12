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
