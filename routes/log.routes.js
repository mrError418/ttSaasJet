const { Router } = require("express");
const bodyParser = require("body-parser");
const handleDisconnect = require("../local_modules/mySql/mysql");
const connection = (handleDisconnect())();


const tables = ["errorst", "actionst"];  
const router = Router();

router.use(bodyParser.json());

// /api/log/
router.get("/:logTable", async (req, res) => {
  const tableName = req.params["logTable"];

  if (tables.includes(tableName))  
{

    connection.query(
      `select * from ${tableName} order by id desc limit 1000;`,

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
