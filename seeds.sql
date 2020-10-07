USE employeetrackerDB;

INSERT INTO department(name) VALUES("Sales"), ("Accounting"), ("Engineering"), ("Human Resources");

INSERT INTO role (title, salary, department_id) VALUES("Sales Manager", 75000.00, 1), ("CFO", 100000.00, 2), ("Lead Engineer", 90000.00, 3), ("HR Manager", 75000.00, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES("Alice", "Cooper", 1), ("Fred", "Andrews", 2), ("Hiram", "Lodge", 3), ("Penelope", "Blossom", 4);