const express = require('express');
const config = require('config');
const { fetchAPI } = require("./local_modules/requestAPI/request");
const mySQLconnection = require("./local_modules/mySql/mysql");

const app = express();
  app.use("/api/data", require("./routes/data.routes"));
 app.use("/api/filter", require("./routes/filter.routes"));


const PORT = config.get("port") || 5000;

async function start() {
  try {
    
    const connection = mySQLconnection();

   /*  connection.query(
      "SELECT table_name FROM information_schema.tables;",
      function (error, results, fields) {
        if (error) throw error;
        // connected!
        console.log(results);

      }
    );
 */
    app.listen(PORT, () =>
      console.log(`server was started on port ${PORT} ...`)
    );
  } catch (e) {
    console.log("error", e.message);
    proces.exit(1);
  }
}

start();
