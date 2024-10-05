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
    cons
}