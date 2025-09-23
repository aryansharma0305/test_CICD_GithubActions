import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  // Fetch todos on mount
  useEffect(() => {
    fetch('/api/getTodos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Error fetching todos:', err))
  }, [])

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return
    try {
      const res = await fetch('/api/addTodos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      })
      const data = await res.json()
      setTodos([...todos, data]) // append new todo
      setNewTodo('') // clear input
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  return (
    <>
      <h1>HopeFully It will get updated</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>{todo.title}</li>
        ))}
      </ul>
    </>
  )
}

export default App
