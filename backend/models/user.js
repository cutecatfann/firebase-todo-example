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
