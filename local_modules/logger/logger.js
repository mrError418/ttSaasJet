const { request } = require("express"); // Читав про вінстон, ніколи не курив тому не використав

const mySQLconnection = require("../mySql/mysql");
const connection = mySQLconnection();

function onError(error, details) {
  connection.query(
    `INSERT INTO errorst(
        lable ,
        error 
    )
    VALUES(
        '${error}' ,
        '${JSON.stringify(details)}'
    );`,

    (error, results, fields) => {
      if (error) throw error;
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
