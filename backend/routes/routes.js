import express from 'express'

import { Todo } from '../models/todos.js'

const router = express.Router()

// POST route to create a new item
router.post('/', async (req, res) => {
  const newTodo = req.body
  const todo = await Todo.create(newTodo)
  res.status(200).send(todo)
})

// GET route to retrieve the _id's of all items
router.get('/', async (req, res) => {
  const todos = await Todo
    .find({},{ _id: 1 }) // find all, but only return the _id's
    .sort({ createdAt: -1 }) // Sort by date desc
  res.send(todos)
})

// GET route to retrieve a specific item
router.get('/:id', async (req, res) => {
  const itemId = req.params.id
  const todo = await Todo.findById(itemId)
  res.status(200).send(todo)
})

// PUT route to update an existing item
router.put('/:id', async (req, res) => {
  const itemId = req.params.id
  await Todo.findByIdAndUpdate(itemId, req.body)
  res.status(201).send()
})

// DELETE route to delete an item
router.delete('/:id', async (req, res) => {
  const itemId = req.params.id
  await Todo.findByIdAndDelete(itemId)
  res.status(201).send()
})

export default router

