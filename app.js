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

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;