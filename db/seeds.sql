USE employee_db;

INSERT INTO department (name)
VALUES ("engineering"), ("managment"), ("legal");

INSERT INTO role (title, salary, department_id)
VALUES ("engineer", 80000, 1), ("manager", 30000, 2), ("lawyer", 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jennifer", "Winter", 1, 2), ("Nora", "Chung", 2, null), ("Grey", "Chung", 3, 2);