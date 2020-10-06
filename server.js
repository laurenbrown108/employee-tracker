//variables
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const { NONAME } = require("dns");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "employeetrackerDB"
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
    }).then(answer => {
        console.log(answer.choice)
        switch(answer.choice) {
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
    inquirer.prompt({
        type: "input",
        message: "Please enter the department name",
        name: "deptName"
    }).then((answer) => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.deptName}");`, (err, res) => {
            if(err) 
                throw err;
            console.log((`"${answer.deptName}" department added!`));
            askQuestions();
        });
    })
    
}
function viewDept() {
    console.log("viewing dept")
}
function addEmployee() {
    //console.log("employee added")
    inquirer.prompt([
    {
        type: "input",
        message: "Enter employee's first name",
        name: "firstName"
    },
    {
        type: "input",
        message: "Enter employee's last name",
        name: "lastName"
    },
    {
        type: "input",
        message: "Enter employee's ID",
        name: "roleID"
    },
    {
        type: "input",
        message: "Enter the ID of the employee's manager if applicable",
        name: "managerID"
    }
    ]).then((answer) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${answer.roleID}, ${answer.managerID});`, (err, res) => {
            if(err) 
                throw err;
            console.log((`Employee ${answer.firstName} ${answer.lastName} added!`));
            askQuestions();
        });

    })
}
// function viewEmployees() {
//     console.log("viewing employee")
// }
 function addRole() {
     console.log("role added")
     inquirer.prompt([
        {
            type: "input",
            message: "Enter role title",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "Enter this role's salary",
            name: "salary"
        },
        {
            type: "input",
            message: "Enter the department ID for this role",
            name: "departmentID"
        }
        ]).then((answer) => {
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleTitle}", ${answer.salary}, ${answer.departmentID});`, (err, res) => {
                if(err) 
                    throw err;
                console.log((`Role ${answer.roleTitle} added!`));
                askQuestions();
            });
    
        })
}
// function viewRoles() {
//     console.log("viewing role")
// }
// function updateRole() {
//     console.log("role updated")
// }
 function none() {
     console.log("quitting")
     connection.end();
}
