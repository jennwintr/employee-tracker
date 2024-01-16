USE employees;

INSERT INTO department(department_name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 85000, 1), ("Senior Engineer", 125000, 1), ("CFO", 350000, 3), ("Chief Counsel", 300000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Kata', 'Ra', 1, 2), ('Toph', 'Beifong', 1, null), ('Ty', 'Lee', 1, 2), ('Princess', 'Yue', 2, 2), ('On', 'Ji', 4, null);