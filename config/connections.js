const mysql = require ("mysql2");

require('dotenv').config();

const connections = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees"
});

module.exports = connections;