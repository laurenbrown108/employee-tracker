DROP DATABASE IF EXISTS employeetrackerDB;

CREATE DATABASE employeetrackerDB;

USE employeetrackerDB;

CREATE TABLE department (
  id INTEGER(3) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER(3) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER(3),
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
  );
  
CREATE TABLE employee (

  id INTEGER(3) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER(3),
  manager_id INTEGER(3),
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id)
  );