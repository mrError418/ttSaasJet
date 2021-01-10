const { request } = require("express"); 


const handleDisconnect = require("../mySql/mysql");

function onError(error, details) {
  let connection = (handleDisconnect())();

  console.log (error, details);
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

  connection.end();
}

function logAction(action, details) {
  let connection = (handleDisconnect())();
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

  connection.end();
}

module.exports = { onError, logAction };
