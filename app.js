const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reading tasks from file
function readTasks() {
    try {
      const tasksData = fs.readFileSync(path.join(__dirname, 'task.json'));
        return JSON.parse(tasksData);
    } catch (error) {
        console.error('Error reading tasks:', error);
        return { tasks: [] };
    }
}

// Writing tasks to file
function writeTasks(tasks) {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'task.json'),
      JSON.stringify(tasks, null, 2)
    );
  } catch (err) {
    console.error('Error writing tasks:', err);
  }
}

// Welcome route
app.get('/', (req, res)=>{
  res.send('Welcome to the Task Manager API!');
});

// Get all tasks
app.get('/tasks', function(req, res) {
    const data = readTasks();
    res.json(data.tasks || []);
});

// Get task by ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readTasks();
  const task = data.tasks.find(task => task.id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.status(200).json(task);
});

// Create new task
app.post('/tasks', (req, res) => {
  const {title, description, completed} = req.body;
  
  // validate inputs
  if (!title || description === undefined) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const data = readTasks();
  
  // Find the highest id and increment by 1
  const maxId = data.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
  const newId = maxId + 1;
  
  const newTask = {
    id: newId,
    title,
    description,
    completed: completed || false
  };
  
  data.tasks.push(newTask);
  writeTasks(data);
  
  res.status(201).json(newTask);
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  
  if (!title && description === undefined && completed === undefined) {
    return res.status(400).json({ error: 'At least one field to update is required' });
  }
  
  // Check if completed is a boolean type when provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean value' });
  }
  
  const data = readTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Update the task with new values while keeping the existing values if not provided
  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    title: title || data.tasks[taskIndex].title,
    description: description !== undefined ? description : data.tasks[taskIndex].description,
    completed: completed !== undefined ? completed : data.tasks[taskIndex].completed
  };
  
  writeTasks(data);
  
  res.status(200).json(data.tasks[taskIndex]);
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const deletedTask = data.tasks[taskIndex];
  data.tasks.splice(taskIndex, 1);
  
  writeTasks(data);
  
  res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;