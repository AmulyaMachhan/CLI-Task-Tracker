const fs = require("fs");
const path = require("path");

const taskFilePath = path.join(__dirname, "tasks.json");

// Color codes
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
};

//Function to read tasks from tasks.json
function readTasks(){
    if(fs.existsSync(taskFilePath)){
        const data = fs.readFileSync(taskFilePath, "utf8");
        return JSON.parse(data)?.tasks;
    }
    return [];
}

console.log(readTasks());
//Function to write tasks in tasks.json
function writeTasks(tasks){
    fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

//Function to get the next ID and use the deleted ID too if available
function getNextID(tasks){
    const ids = tasks.map(task => task.id);
    ids.sort((a,b) => a - b);
    let nextID = 1;
    for(const id of ids){
        if(id !== nextID) break;
        nextID++;
    }
    return nextID;
}

//Function to list all the tasks in tasks.json
function listTasks(status){
    const tasks = readTasks();
    let filteredTasks = tasks;

    if(status){
        if(status.toLowerCase() === "done"){
            filteredTasks = tasks.filter(task => task.completed);
        }else if(status.toLowerCase() === "in-progress"){
            filteredTasks = tasks.filter(task => task.inProgress);
        }else if(status.toLowerCase() === "to-do"){
            filteredTasks = tasks.filter(task => !task.inProgress && !task.completed);
        }else {
            console.log(
                `${colors.red}Invalid status. Use 'done', 'to-do', or 'in-progress'.${colors.reset}`
              );
            return;
        }
    }

    if(filteredTasks.length === 0){
        console.log(`${colors.yellow}No tasks found.${colors.reset}`);
    }else{
        console.log(
            `${colors.cyan}Listing ${status ? status : "all"} tasks:${colors.reset}`
        );
        filteredTasks.forEach((task) => {
            console.log(
                `${task.id}. ${task.description} [${
                task.completed
                    ? colors.green + "Done"
                    : task.inProgress
                    ? colors.yellow + "In-progress"
                    : colors.red + "To-do"
                }${colors.reset}]`
            );
        });
    }
}

//Function to add tasks to the tasks.json
function addTask(description){
    const tasks = readTasks();
    const newTask = {
        id : getNextID(tasks),
        description,
        completed : false,
        inProgress : false
    };
    
    tasks.push(newTask);
    writeTasks(tasks);

    console.log(
        `${colors.green}Task added successfully! (ID: ${newTask.id})${colors.reset}`
    );  
}

//Function to update a given task with new description
function updateTask(id, newDescription){
    const tasks = readTasks();

    const task = tasks.find(task => task.id === parseInt(id));
    if(!task){
        console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
        return;
    }

    task.description = newDescription;
    writeTasks(tasks);
    console.log(
        `${colors.green}Task ID ${id} updated successfully!${colors.reset}`
    );
}

//Function to delete a task with given ID
function deleteTasks(id){
    const tasks = readTasks();
    const newTasks = tasks.filter(task => task.id !== parseInt(id));

    if(newTasks.length < tasks.length){
        writeTasks(newTasks);
        console.log(
            `${colors.green}Task ID ${id} deleted successfully!${colors.reset}`
        );
    } else {
        console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    }
}

//Function to mark a task in progress
function markInProgress(id){
    const tasks = readTasks();
    const task = tasks.find(task => task.id === parseInt(id));

    if(!task){
        console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
        return;
    }

    task.inProgress = true;
    task.completed = false;
    writeTasks(tasks);
    console.log(
        `${colors.yellow}Task ID ${id} marked as in-progress.${colors.reset}`
    );
}

//Function to mark a task as done
function markAsDone(id){
    const tasks = readTasks();
    const task = tasks.find(task => task.id === parseInt(id));

    if(!task){
        console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
        return;
    }

    task.inProgress = false;
    task.completed = true;
    writeTasks(tasks);
    console.log(
        `${colors.yellow}Task ID ${id} marked as in-progress.${colors.reset}`
    );   
}

// Helper function for showing errors
const showError = (message, sample) => {
    console.log(`${colors.red}${message}${colors.reset}`);
    if (sample) console.log(`${colors.yellow}Sample: ${sample}${colors.reset}`);
};

// Helper function for showing help
const showHelp = () => {
    console.log(`${colors.cyan}Usage: node index.js <command> [arguments]${colors.reset}`);
    console.log(`${colors.cyan}Commands:${colors.reset}`);
    console.log(`${colors.yellow}  add <task description>            - Add a new task${colors.reset}`);
    console.log(`${colors.yellow}  list [status]                     - List tasks (status: done, to-do, in-progress)${colors.reset}`);
    console.log(`${colors.yellow}  update <id> <new description>     - Update a task by ID${colors.reset}`);
    console.log(`${colors.yellow}  delete <id>                       - Delete a task by ID${colors.reset}`);
    console.log(`${colors.yellow}  mark-in-progress <id>             - Mark a task as in-progress by ID${colors.reset}`);
    console.log(`${colors.yellow}  mark-done <id>                    - Mark a task as done by ID${colors.reset}`);
};

//Command line interface login
const args = process.argv.slice(2);

if(args[0] === "add"){
    const taskDescription = args.slice(1).join(" ");
    if(!taskDescription){
        showError("Please provide a task description.", 'node index.js add "Drink Water"');
        return;
    }

    addTask(taskDescription);
}
else if(args[0] === "list"){
    const status = args[1]; // "done", "to-do", "in-progress" (optional)
    listTasks(status);
}
else if(args[0] === "update"){
    const id = args[1];
    const newDescription = args.slice(1).join(" ");

    if (!id || !newDescription) {
        showError(
            "Please provide a task ID and new description.",
            'node index.js update 1 "Updated task description"'
          );
        return;
    }

    updateTask(id, newDescription);
}
else if(args[0] === "delete"){
    const id = args[1];
    if (!id) {
        showError("Please provide a task ID.", "node index.js delete 1");
        return;
    }

    deleteTasks(id);
}
else if(args[0] === "mark-in-progress"){
    const id = args[1];
    if (!id) {
        showError("Please provide a task ID.", "node index.js mark-in-progress 1");
        return;
    } 

    markInProgress(id);
}
else if(args[0] === "mark-done"){
    const id = args[1];
    if (!id) {
        showError("Please provide a task ID.", "node index.js mark-in-progress 1");
        return;
    } 

    markAsDone(id);
}
else{
    showHelp();
}