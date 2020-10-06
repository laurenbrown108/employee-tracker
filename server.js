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

connection.connect((err) => {
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
        //console.log(answer.choice)
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
            console.log((`\n"${answer.deptName}" department added!\n`));
            askQuestions();
        });
    })
    
}
function viewDept() {
    //console.log("viewing dept")
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err)
        throw err;
        console.log(`\nDisplaying Departments...\n`)
        console.table(res);
        askQuestions();
    })
}
function addEmployee() {
    //I think role array needs to go here so employee can connect w/ role id
    // and connect to dept table
    //Maybe employees array too so employees can connect if manager needs to be related?
    // and connect to employee db...twice?
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
            console.log((`\n Employee ${answer.firstName} ${answer.lastName} added! \n`));
            askQuestions();
        });

    })
}
function viewEmployees() {
    //console.log("viewing employee")
    let query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err)
        throw err;
        console.log(`\nDisplaying Employees...\n`)
        console.table(res);
        askQuestions();
    })
}
 function addRole() {
     //I think department array needs to go here so role can connect w/ dept id
     //and connect to dept db
    let departmentsArray = [];
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err)
            throw err;
        //LEFT OFF HERE
        departmentsArray = res.map(({ id, name}) => ({
            name: name,
            value: id
        }))
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
                type: "list",
                message: "Select the department ID for this role",
                name: "departmentID",
                choices: departmentsArray
            }
        ]).then((answer) => {
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleTitle}", ${answer.salary}, ${answer.departmentID});`, (err, res) => {
                    if(err) 
                        throw err;
                    console.log((`Role ${answer.roleTitle} added!`));
                    askQuestions();
                });
    
    
            })        
    })
}
function viewRoles() {
    //console.log("viewing role")
    let query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err)
        throw err;
        console.log(`\nDisplaying Roles...\n`)
        console.table(res);
        askQuestions();
    })

}
// function updateRole() {
//     console.log("role updated")
// }
 function none() {
     console.log(`\nQuitting\n`)
     connection.end();
}
