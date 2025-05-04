# Task Manager API

this is my first NodeJS API project for Airtribe! Its a project for managing tasks using an api built with nodejs. It does CRUD operations and has validation for errors when triggering the api.

## how to use

1. clone the repo
2. Run npm install
3. Start the server: node app.js
4. Open browser to http://localhost:3000 or on postmann

## API Endpoints

The api has these endpoints:

### GET /tasks
* Gets all tasks 
* Or you can filter with completed status like /tasks?completed=true
EXAMPLE:
curl http://localhost:3000/tasks or run the same on postmann
 
### GET /tasks/:id
Gets a specific task by its ID
curl http://localhost:3000/tasks/1

### GET task by priority level

You can get all tasks with a specific priority level (low/medium/high) by doing:
GET /tasks/priority/:level

The response will have the tasks matching that priority.

Example:
curl http://localhost:3000/tasks/priority/high


### POST /tasks - Creating a new task
To create a task you need to send a JSON with 'title' + 'description', both are reqd, rest of the 
params named: 'completed' and 'priority' are optional
{
  "title": "My new task",
  "description": "This is a test task",
  "completed": false,
  "priority": "high"  
}

Priority is medium by default if not specified.

### PUT /tasks/:id
For updating an existing task that has a specific ID in the endpoint.
Send the fields you want to update:

{
  "title": "updated title",
  "completed": true,
  "priority": "low"
}


##DELETE /tasks/:id** - Deletes a task by ID
You just send a DELETE request to /tasks/:id and it will delete it.

## Notes
- Tasks stored in task.json file

## ERRORS
The API has proper error messages for different scenarios:
--- 404: When a task isn't found  
--- 400: When requested data is invalid

## technologies Used
- NodeJS
- Express
- json file for storage