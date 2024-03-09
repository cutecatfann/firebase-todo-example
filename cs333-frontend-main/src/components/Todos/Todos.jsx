import { useCallback, useEffect, useState } from 'react'

import { Todo } from '../Todo/Todo'
import { CreateTodo } from './CreateTodo'

/**
 * Renders the Todos component.
 * @returns {JSX.Element} The rendered Todos component.
 */
const Todos = () => {
  const [ todoIds, setTodoIds ] = useState([])

  /**
   * Fetches data from the specified URL and sets the todo IDs.
   * @returns {Promise<void>} A promise that resolves when the data is fetched and the todo IDs are set.
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000')
      const jsonResponse = await response.json()
      setTodoIds(jsonResponse)
    } catch (error) {
      console.log(error)
    }
  },[])

  /**
   * Handles the creation of a new todo.
   * @param {Object} newTodo - The new todo object to be created.
   * @returns {Promise<void>} - A promise that resolves when the creation is complete.
   */
  const handleCreate = useCallback(async (newTodo) => {
    try {
      await fetch("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
    } catch (error) {
      console.log(error);
    }
    await fetchData();
  }, [fetchData]);

  // intial fetch
  useEffect(() => {
    fetchData()
  },[fetchData])

  return (
    <>
      <CreateTodo handleCreate={handleCreate} />
      {todoIds.length === 0 && <p>No todos to display</p>}
      <ul>
        {todoIds.map(todo => (
          <li key={todo._id}>
            <Todo id={todo._id} fetchData={fetchData} />
          </li>
        ))}
      </ul>
    </>
  )
}

/* CHALLENGE: Add a the sum of remaining todos to a footer. */

export default Todos
