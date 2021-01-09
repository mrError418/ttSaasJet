const express = require("express");
const config = require("config");
const { fetchAPI } = require("./local_modules/requestAPI/request");
const mySQLconnection = require("./local_modules/mySql/mysql");

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

function handleDisconnect() {
  const connection = mySQLconnection();   
                                                  

  connection.connect(function(err) {              
    if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }                                     
  });                                     
                                          
  connection.on('error', function(err) {
    console.log( 'PROTOCOL_CONNECTION_LOST')                     
  //  console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();    
      console.log( 'PROTOCOL_CONNECTION_LOST')                     
    } else {                                      
      throw err;                                  
    }
  });
}
