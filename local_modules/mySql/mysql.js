const mysql = require("mysql");
const config = require("config");
const conectionObj= config.get('mysql');



module.exports = ()=>connection = mysql.createConnection(conectionObj) ;