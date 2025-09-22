require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connection');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET /api/getTodos → fetch all todos
app.get('/api/getTodos', async (req, res) => {
    console.log("Received request for /api/getTodos");
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/addTodos → add a new todo
app.post('/api/addTodos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newTodo = new Todo({ title });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
