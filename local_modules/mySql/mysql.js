const mysql = require("mysql");
const config = require("config");
const conectionObj= config.get('mysql');

function handleDisconnect() {
    const connection = mysql.createConnection(conectionObj);   
                                                    
  
    connection.connect(function(err) {              
      if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); 
      }                                     
    });                                     
                                            
    connection.on('error', function(err) {
                       
    //  console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        handleDisconnect();    
       
      } else {                                      
        throw err;                                  
      }
    });

    return connection;
  }

module.exports = ()=>  handleDisconnect  