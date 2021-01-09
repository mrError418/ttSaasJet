const { request } = require("express"); 


const handleDisconnect = require("../mySql/mysql");
const connection = (handleDisconnect())();

function onError(error, details) {
  console.log (error, details);
  process.exit();
  connection.query(
    `INSERT INTO errorst(
        lable ,
        error 
    )
    VALUES(
        '"${error}"' ,
        '"${JSON.stringify(details)}"
    );`,

    (error, results, fields) => {
      if (error) 
      //throw error;
     console.log('problem during creation' , new Date())
      // connected!
      }
  );
}

function logAction(action, details) {
  connection.query(
    `INSERT INTO actionst(
            action ,
            details 
        )
        VALUES(
            '${action}' ,
            '${JSON.stringify(details)}'
        );`,

        (error, results, fields) => {
          if (error) throw error;
          // connected!
          
          }
  )
}

module.exports = { onError, logAction };
