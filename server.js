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