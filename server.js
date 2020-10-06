//variables
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const { NONAME } = require("dns");
const { emitKeypressEvents } = require("readline");

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
        switch (answer.choice) {
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
            if (err)
                throw err;
            console.log((`\n"${answer.deptName}" department added!\n`));
            askQuestions();
        });
    })

}
function viewDept() {
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
    let query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err)
            throw err;
        const employees = res.map(({ first_name, last_name, id }) => ({
            name: first_name + " " + last_name,
            value: id
        }))
        let query = "SELECT * FROM role";
        connection.query(query, (err, res) => {
            if (err)
                throw err;

            const roles = res.map(({ title, id }) => ({
                name: title,
                value: id
            }))
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
                    type: "list",
                    message: "Select employee's role",
                    choices: roles,
                    name: "roleID"
                },
                {
                    type: "list",
                    message: "If applicable, assign manager to this employee",
                    choices: employees,
                    name: "managerID"
                }
            ]).then((answer) => {
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${answer.roleID}, ${answer.managerID});`, (err, res) => {
                    if (err)
                        throw err;
                    console.log((`\n Employee ${answer.firstName} ${answer.lastName} added! \n`));
                    askQuestions();
                });
            })
        })
    })
}
function viewEmployees() {
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
    let departmentsArray = [];
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err)
            throw err;

        departmentsArray = res.map(({ name, id }) => ({
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
                message: "Select the department for this role",
                name: "departmentID",
                choices: departmentsArray
            }
        ]).then((answer) => {
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleTitle}", ${answer.salary}, ${answer.departmentID});`, (err, res) => {
                if (err)
                    throw err;
                console.log((`\nRole ${answer.roleTitle} added!\n`));
                askQuestions();
            });


        })
    })
}
function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err)
            throw err;
        console.log(`\nDisplaying Roles...\n`)
        console.table(res);
        askQuestions();
    })

}
function updateRole() {
    let query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err)
            throw err;
        const allEmployees = res.map(({ first_name, last_name, id }) => ({
            name: first_name + " " + last_name,
            value: id
        }))
        let query = "SELECT * FROM role";
        connection.query(query, (err, res) => {
            if (err)
                throw err;
            const allRoles = res.map(({ title, id }) => ({
                name: title,
                value: id
            }))

            inquirer.prompt([
                {
                    type: "list",
                    message: "Select an employee to update their role",
                    name: "updatedEmployee",
                    choices: allEmployees
                },
                {
                    type: "list",
                    message: "Select a new role for this employee",
                    name: "updatedRole",
                    choices: allRoles
                }
            ]).then((answer) => {
                connection.query(`UPDATE employee set role_id="${answer.updatedRole}"  where id="${answer.updatedEmployee}"`, (err, res => {
                    if (err)
                        throw err;
                    console.log((`\nRole updated!\n`));
                    askQuestions();
                }))
            })

        })
    })
}
function none() {
    console.log(`\nQuitting\n`)
    connection.end();
}
