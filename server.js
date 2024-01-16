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

  // Update an Employee's Role
const updateEmployeeRole = async () => {
    try {
      const [employeeResponse] = await connection.promise().query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
        FROM employee, role, department 
        WHERE department.id = role.department_id AND role.id = employee.role_id`
      );
  
      // Create an array employeeNamesArray by mapping over each element in employeeResponse
      // map in this context is to transform the array of employee objects (employeeResponse) into an array of strings, specifically, an array of full names
      let employeeNamesArray = employeeResponse.map(
        (employee) => `${employee.first_name} ${employee.last_name}`
      );
  
      // Execute a SQL query to select role information and assign the result to roleResponse
      const [roleResponse] = await connection
        .promise()
        .query(`SELECT role.id, role.title FROM role`);
  
      // Create an array rolesArray by mapping over each element in roleResponse
      let rolesArray = roleResponse.map((role) => role.title);
  
      const answer = await inquirer.prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee has a new role?",
          choices: employeeNamesArray,
        },
        {
          name: "chosenRole",
          type: "list",
          message: "What is their new role?",
          choices: rolesArray,
        },
      ]);
  
      let newTitleId, employeeId;
  
      roleResponse.forEach((role) => {
        if (answer.chosenRole === role.title) {
          newTitleId = role.id;
        }
      });
  
      employeeResponse.forEach((employee) => {
        if (
          answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
        ) {
          employeeId = employee.id;
        }
      });
  
      // Define an SQL query string for updating the role_id of an employee
      const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
      // newTitleId would replace the first question mark (?) as the value for updating the role_id, and employeeId would replace the second question mark (?) as the condition for identifying the specific employee whose role_id is being updated.
  
      // Execute the SQL query asynchronously using the connection, passing [newTitleId, employeeId] as parameters
      await connection.promise().query(sql, [newTitleId, employeeId]);
  
      console.log(
        chalk.greenBright.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.greenBright(`Employee Role Updated`));
      console.log(
        chalk.greenBright.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Update an Employee's Manager
  const updateEmployeeManager = async () => {
    try {
      const [response] = await connection.promise().query(
        `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
        FROM employee`
      );
  
      let employeeNamesArray = response.map(
        (employee) => `${employee.first_name} ${employee.last_name}`
      );
  
      const answer = await inquirer.prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee has a new manager?",
          choices: employeeNamesArray,
        },
        {
          name: "newManager",
          type: "list",
          message: "Who is their manager?",
          choices: employeeNamesArray,
        },
      ]);
  
      let employeeId, managerId;
  
      response.forEach((employee) => {
        if (
          answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
        ) {
          employeeId = employee.id;
        }
  
        if (
          answer.newManager === `${employee.first_name} ${employee.last_name}`
        ) {
          managerId = employee.id;
        }
      });
  
      if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
        console.log(
          chalk.redBright.bold(
            `====================================================================================`
          )
        );
        console.log(chalk.redBright(`Invalid Manager Selection`));
        console.log(
          chalk.redBright.bold(
            `====================================================================================`
          )
        );
        promptUser();
      } else {
        const sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
        await connection.promise().query(sql, [managerId, employeeId]);
  
        console.log(
          chalk.greenBright.bold(
            `====================================================================================`
          )
        );
        console.log(chalk.greenBright(`Employee Manager Updated`));
        console.log(
          chalk.greenBright.bold(
            `====================================================================================`
          )
        );
        promptUser();
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Delete an Employee
  const removeEmployee = async () => {
    try {
      const [response] = await connection
        .promise()
        .query(
          `SELECT employee.id, employee.first_name, employee.last_name FROM employee`
        );
  
      let employeeNamesArray = response.map(
        (employee) => `${employee.first_name} ${employee.last_name}`
      );
  
      const answer = await inquirer.prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: employeeNamesArray,
        },
      ]);
  
      let employeeId;
  
      response.forEach((employee) => {
        if (
          answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
        ) {
          employeeId = employee.id;
        }
      });
  
      const sql = `DELETE FROM employee WHERE employee.id = ?`;
      // only one parameter (employeeId), you still need to pass it as an array because the query method expects an array of values to replace placeholders in the SQL query.
      await connection.promise().query(sql, [employeeId]);
  
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.redBright(`Employee Successfully Removed`));
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      await viewAllEmployees();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Delete a Role
  const removeRole = async () => {
    try {
      // Using [response] in the destructuring assignment extracts the first element of the array and assigns it to the variable response. This syntax is a concise way of accessing the result directly without having to reference it as result[0] later in the code.
      const [response] = await connection
        .promise()
        .query(`SELECT role.id, role.title FROM role`);
  
      let roleNamesArray = response.map((role) => role.title);
  
      const answer = await inquirer.prompt([
        {
          name: "chosenRole",
          type: "list",
          message: "Which role would you like to remove?",
          choices: roleNamesArray,
        },
      ]);
  
      let roleId;
  
      response.forEach((role) => {
        if (answer.chosenRole === role.title) {
          roleId = role.id;
        }
      });
  
      const sql = `DELETE FROM role WHERE role.id = ?`;
      await connection.promise().query(sql, [roleId]);
  
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.greenBright(`Role Successfully Removed`));
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      await viewAllRoles();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Delete a Department
  const removeDepartment = async () => {
    try {
      const [response] = await connection
        .promise()
        .query(
          `SELECT department.id, department.department_name FROM department`
        );
  
      let departmentNamesArray = response.map(
        (department) => department.department_name
      );
  
      const answer = await inquirer.prompt([
        {
          name: "chosenDept",
          type: "list",
          message: "Which department would you like to remove?",
          choices: departmentNamesArray,
        },
      ]);
  
      let departmentId;
  
      response.forEach((department) => {
        if (answer.chosenDept === department.department_name) {
          departmentId = department.id;
        }
      });
  
      const sql = `DELETE FROM department WHERE department.id = ?`;
      await connection.promise().query(sql, [departmentId]);
  
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.redBright(`Department Successfully Removed`));
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      await viewAllDepartments();
    } catch (error) {
      console.error(error);
    }
  };