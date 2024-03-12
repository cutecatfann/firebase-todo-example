import { useState } from 'react'

import { Button } from '../common/Button'

/**
 * Component for creating a new todo.
 *
 * @component
 * @returns {JSX.Element} The CreateTodo component.
 */
export function CreateTodo({ handleCreate }) {
  const [title, setTitle] = useState('')

  /**
   * Handles the input change event.
   *
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    setTitle(e.target.value)
  }

  /**
   * Handles the form submit event.
   *
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!title) return
    const newTodo = { title, isCompleted: false }    
    await handleCreate(newTodo)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleInputChange}
        placeholder="Enter a new todo"
      />
      <Button type="submit">Add Todo</Button>
    </form>
  )
}
