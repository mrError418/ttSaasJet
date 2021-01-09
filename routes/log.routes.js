const { Router } = require("express");
const bodyParser = require("body-parser");
const mySQLconnection = require("../local_modules/mySql/mysql");
const connection = mySQLconnection();

const tables = ["errorst", "actionst"];  
const router = Router();

router.use(bodyParser.json());

// /api/log/
router.get("/:logTable", async (req, res) => {
  const tableName = req.params["logTable"];

  if (tables.includes(tableName))  //he he BOY :)
{
  console.log(connection);
    connection.query(
      `select * from ${tableName} order by id desc limit 100;`,

      (error, results, fields) => {
        if (error) throw error;
        // connected!
        res.json(results);
      }
    );
}else{
  res.sendStatus(404)
}
});

module.exports = router;
