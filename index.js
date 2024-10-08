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