const fs = require('fs');

// Check if tasks.json exists, if not create it
let tasks = [];
if (fs.existsSync('tasks.json')) {
    const data = fs.readFileSync('tasks.json', 'utf8');
    tasks = JSON.parse(data);
} else {
    // Create the file if it doesn't exist
    fs.writeFileSync('tasks.json', JSON.stringify([], null, 2), 'utf-8');
}

// Command-line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Please provide a command, use `help` to see available commands");
    process.exit(1);
}

const command = args[0];
const details = args.slice(1).join(" ");

// Helper function to save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2), 'utf-8');
}

switch (command) {
    case "add":
        if (!details) {
            console.log("Please provide the task details");
        } else {
            const newtask = {
                id: tasks.length + 1,
                description: details,
                status: 'mark-in-progress'
            };
            tasks.push(newtask);
            console.log("Added new task", newtask);
            saveTasks(tasks); // Save the updated task list to file
        }
        break;
        
    case "list":
        if (tasks.length === 0) {
            console.log("No tasks to show, please add a task.");
        } else {
            console.log("Here are your tasks:");
            tasks.forEach(task => {
                console.log(`Id: ${task.id}, Description: ${task.description}, Status: ${task.status}`);
            });
        }
        break;

    case "update":
        if (!details) {
            console.log("Please specify the task id and details to update. Example: update 1 done");
        } else {
            const [id, ...updatedetails] = details.split(" ");
            const taskid = parseInt(id, 10);
            const update = updatedetails.join(" ");
            const taskindex = tasks.findIndex((task) => task.id === taskid);
            
            if (taskindex === -1) {
                console.log(`Task with id ${taskid} not found`);
            } else {
                if (update.toLowerCase() === "mark-done" || update.toLowerCase() === "mark-in-progress") {
                    tasks[taskindex].status = update.toLowerCase();
                    console.log(`Updated task ${taskid} to status ${update}`);
                } else {
                    tasks[taskindex].description = update;
                    console.log(`Updated task ${taskid} description to "${update}"`);
                }
                saveTasks(tasks); // Save the updated task list to file
            }
        }
        break;

    case "delete":
        if (!details) {
            console.log("Please provide the task id to delete. Example: delete 1");
        } else {
            const taskid = parseInt(details, 10);
            const taskIndex = tasks.findIndex((task) => task.id === taskid);
            
            if (taskIndex === -1) {
                console.log(`Task with id ${taskid} not found`);
            } else {
                tasks.splice(taskIndex, 1); // Remove the task from the array
                console.log(`Deleted task with id ${taskid}`);
                saveTasks(tasks); // Save the updated task list to file
            }
        }
        break;

    case "filter":
        if (!details) {
            console.log("Please provide the status to filter by. Example: filter done");
        } else {
            const filteredTasks = tasks.filter((task) => task.status.toLowerCase() === details.toLowerCase());
            
            if (filteredTasks.length === 0) {
                console.log(`No tasks found with status ${details}`);
            } else {
                console.log(`Here are your ${details} tasks:`);
                filteredTasks.forEach(task => {
                    console.log(`Id: ${task.id}, Description: ${task.description}, Status: ${task.status}`);
                });
            }
        }
        break;

    case "help":
        console.log("Available commands:");
        console.log("  add [task]   - Add a new task");
        console.log("  list         - List all tasks");
        console.log("  update [id] [status/description] - Update task status or description");
        console.log("  delete [id]  - Delete a task");
        console.log("  filter [status] - Filter tasks by status (e.g., 'done', 'mark-in-progress')");
        console.log("  help         - Show available commands");
        break;

    default:
        console.log(`Unknown command: ${command}. Use 'help' to see available commands.`);
}
