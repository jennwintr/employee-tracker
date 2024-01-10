const mysql = require ("mysql2")

const connections = mysql.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db"
})

connections.connect(()=>{
    console.log("connected")
})

module.exports = connections;