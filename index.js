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