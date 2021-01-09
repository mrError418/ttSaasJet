const express = require("express");
const config = require("config");
const { fetchAPI } = require("./local_modules/requestAPI/request");
const handleDisconnect = require("./local_modules/mySql/mysql");

const app = express();
app.use("/api/action", require("./routes/action.routes"));
app.use("/api/data", require("./routes/data.routes"));
app.use("/api/filter", require("./routes/filter.routes"));
app.use("/api/log", require("./routes/log.routes"));

// routing
app.use('/',require('./routes/routing'));
app.use('/static', express.static('client'));

const PORT = config.get("port") || 5000;

async function start() {
  try {
    handleDisconnect()
  /*   connection.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = abc`, function(err, tables){ 
      console.log(tables , 'gees');
  }); */

    app.listen(PORT, () =>
      console.log(`server was started on port ${PORT} ...`)
    );
  } catch (e) {
    console.log("error", e.message);
    proces.exit(1);
  }
}

start();


