const mysql = require('mysql2')
require('dotenv').config()




const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.dbName
})


connection.connect((err)=>{
    if(err){
        
        console.log("there is an error with connection to the database")
    }else{
        console.log("the connection to database was seccessful")
    }
})

module.exports = connection