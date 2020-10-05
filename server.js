//variables
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const { NONAME } = require("dns");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "playlist_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    askQuestions();
});

//inquirer prompts
function askQuestions() {
    inquirer.prompt({
        type: "list",
        message: "Select an option:",
        choices: ([
            "Add department",
            "View department",
            "Add employee",
            "View employees",
            "Add role",
            "View roles",
            "Update an employee's role",
            "None"
        ]),
        name: "choice"
    }).then(response => {
        console.log(response.choice)
        switch(response.choice) {
            case "Add department":
                addDept();
                break;
            case "View department":
                viewDept();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "View employees":
                viewEmployees();
                break;
            case "Add role":
                addRole();
                break;
            case "View roles":
                viewRoles();
                break;
            case "Update an employee's role":
                updateRole();
                break;
            default:
                none();
            
        }
    })
}

function addDept() {
    console.log("dept added")
}
function viewDept() {
    console.log("viewing dept")
}
function addEmployee() {
    console.log("employee added")
}
function viewEmployees() {
    console.log("viewing employee")
}
function addRole() {
    console.log("role added")
}
function viewRoles() {
    console.log("viewing role")
}
function updateRole() {
    console.log("role updated")
}
function none() {
    console.log("quitting")
    connection.end();
}


  //include in last function
  //connection.end();