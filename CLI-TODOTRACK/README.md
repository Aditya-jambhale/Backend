# Task Tracker CLI

**Task Tracker CLI** is a simple command-line application that helps you track and manage your tasks. This tool allows you to add, list, update, delete, and filter tasks, with all data stored in a JSON file for persistence.

---

## Features

- Add tasks with descriptions.
- List all tasks.
- Update tasks (mark as done, mark as in-progress, or update descriptions).
- Delete tasks by ID.
- Filter tasks by status (`mark-done`, `mark-not-done`, `mark-in-progress`).
- Persistent storage using a `tasks.json` file.

---

## Requirements

- [Node.js](https://nodejs.org/) must be installed on your machine.
---
## Usage 

1. Add task 
- node index.js add "Your task description here"

2. List all tasks
- node index.js list

3. Update a task
- Mark a task as done: node index.js update <task-id> mark-done
- Mark a task as in-progress: node index.js update <task-id> mark-in-progress
- Update a task description: node index.js update <task-id> "New task description"

4. Delete a task
- node index.js delete <task-id>

5. Filter tasks by status
- Filter tasks marked as done: node index.js filter mark-done
- Filter tasks marked as not done:node index.js filter mark-not-done
- Filter tasks marked as in progress: node index.js filter mark-in-progress

6. Help
- node index.js help

**File Details**
- tasks.json:This file is used to store the task data persistently. It will be created automatically if it doesn't exist in the project directory.
