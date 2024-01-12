const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const validate = require("./javascript/validate");

// Database Connect and Starter Title
connection.connect((error) => {
    if (error) throw error;
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
  
    console.log(``);
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
  
  // Prompt User for Choices
  const promptUser = () => {
    inquirer
      .prompt([
        {
          name: "choices",
          type: "list",
          message: "Please select an option:",
          choices: [
            "View All Employees",
            "View All Roles",
            "View All Departments",
            "View All Employees By Department",
            "View Department Budgets",
            "Update Employee Role",
            "Update Employee Manager",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Remove Employee",
            "Remove Role",
            "Remove Department",
            "Exit",
          ],
        },
      ])
      .then((answers) => {
        const { choices } = answers;
  
        if (choices === "View All Employees") {
          viewAllEmployees();
        }
  
        if (choices === "View All Departments") {
          viewAllDepartments();
        }
  
        if (choices === "View All Employees By Department") {
          viewEmployeesByDepartment();
        }
  
        if (choices === "Add Employee") {
          addEmployee();
        }
  
        if (choices === "Remove Employee") {
          removeEmployee();
        }
  
        if (choices === "Update Employee Role") {
          updateEmployeeRole();
        }
  
        if (choices === "Update Employee Manager") {
          updateEmployeeManager();
        }
  
        if (choices === "View All Roles") {
          viewAllRoles();
        }
  
        if (choices === "Add Role") {
          addRole();
        }
  
        if (choices === "Remove Role") {
          removeRole();
        }
  
        if (choices === "Add Department") {
          addDepartment();
        }
  
        if (choices === "View Department Budgets") {
          viewDepartmentBudget();
        }
  
        if (choices === "Remove Department") {
          removeDepartment();
        }
  
        if (choices === "Exit") {
          connection.end();
        }
      });
  };



  // View All Employees
const viewAllEmployees = async () => {
    try {
      let sql = `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.department_name AS 'department', 
                    role.salary
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
  
      const [rows] = await connection.promise().query(sql);
  
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` + chalk.green.bold(`Current Employees:`)
      );
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.table(rows);
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } catch (error) {
      console.error(error);
    }
  };
  
  // View all Roles
  const viewAllRoles = async () => {
    try {
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` +
          chalk.green.bold(`Current Employee Roles:`)
      );
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      const sql = `SELECT role.id, role.title, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
      const [rows] = await connection.promise().query(sql);
  
      rows.forEach((role) => {
        console.log(role.title);
      });
  
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } catch (error) {
      console.error(error);
    }
  };
  
  // View all Departments
  const viewAllDepartments = async () => {
    try {
      const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
      const [rows] = await connection.promise().query(sql);
  
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` + chalk.green.bold(`All Departments:`)
      );
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.table(rows);
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } catch (error) {
      console.error(error);
    }
  };
  
  // View all Employees by Department
  const viewEmployeesByDepartment = async () => {
    try {
      const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.department_name AS department
                      FROM employee 
                      LEFT JOIN role ON employee.role_id = role.id 
                      LEFT JOIN department ON role.department_id = department.id`;
      const [rows] = await connection.promise().query(sql);
  
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` +
          chalk.green.bold(`Employees by Department:`)
      );
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.table(rows);
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } catch (error) {
      console.error(error);
    }
  };
  
  // View all Departments by Budget
  const viewDepartmentBudget = async () => {
    try {
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` +
          chalk.green.bold(`Budget By Department:`)
      );
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      const sql = `SELECT department_id AS id, 
                      department.department_name AS department,
                      SUM(salary) AS budget
                      FROM  role  
                      INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
      const [rows] = await connection.promise().query(sql);
  
      console.table(rows);
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } catch (error) {
      console.error(error);
    }
  };

  // Add a New Employee
const addEmployee = async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
          validate: (addFirstName) => {
            if (addFirstName) {
              return true;
            } else {
              console.log("Please enter a first name");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
          validate: (addLastName) => {
            if (addLastName) {
              return true;
            } else {
              console.log("Please enter a last name");
              return false;
            }
          },
        },
      ]);
  
      const roleData = await connection
        .promise()
        .query("SELECT role.id, role.title FROM role");
      const roles = roleData[0].map(({ id, title }) => ({
        name: title,
        value: id,
      }));
  
      const roleChoice = await inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: roles,
        },
      ]);
  
      const managerData = await connection
        .promise()
        .query("SELECT * FROM employee");
      const managers = managerData[0].map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));
  
      const managerChoice = await inquirer.prompt([
        {
          type: "list",
          name: "manager",
          message: "Who is the employee's manager?",
          choices: managers,
        },
      ]);
  
      const crit = [
        answers.firstName,
        answers.lastName,
        roleChoice.role,
        managerChoice.manager,
      ];
  
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;
  
      await connection.promise().query(sql, crit);
  
      console.log("Employee has been added!");
      await viewAllEmployees();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Add a New Role
  const addRole = async () => {
    try {
      const [response] = await connection
        .promise()
        .query("SELECT * FROM department");
      let deptNamesArray = response.map(
        (department) => department.department_name
      );
      deptNamesArray.push("Create Department");
  
      const answer = await inquirer.prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role in?",
          choices: deptNamesArray,
        },
      ]);
  
      if (answer.departmentName === "Create Department") {
        await addDepartment();
      } else {
        await addRoleResume(answer);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const addRoleResume = async (departmentData) => {
    try {
      const answer = await inquirer.prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the name of your new role?",
          validate: validate.validateString,
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of this new role?",
          validate: validate.validateSalary,
        },
      ]);
  
      let createdRole = answer.newRole;
      let departmentId;
  
      departmentData.forEach((department) => {
        if (departmentData.departmentName === department.department_name) {
          departmentId = department.id;
        }
      });
  
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      const crit = [createdRole, answer.salary, departmentId];
  
      await connection.promise().query(sql, crit);
  
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.greenBright(`Role successfully created!`));
      console.log(
        chalk.green.bold(
          `====================================================================================`
        )
      );
      await viewAllRoles();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Add a New Department
  const addDepartment = async () => {
    try {
      const answer = await inquirer.prompt([
        {
          name: "newDepartment",
          type: "input",
          message: "What is the name of your new Department?",
          validate: validate.validateString,
        },
      ]);
  
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      await connection.promise().query(sql, answer.newDepartment);
  
      console.log(``);
      console.log(
        chalk.greenBright(
          answer.newDepartment + ` Department successfully created!`
        )
      );
      console.log(``);
      await viewAllDepartments();
    } catch (error) {
      console.error(error);
    }
  };