const { Router } = require("express");
const bodyParser = require("body-parser");
const { fetchAPI } = require("../local_modules/requestAPI/request");
const config = require("config");

const router = Router();

router.use(bodyParser.json());

//  /api/filter
router.get(
  "/",

  async (req, res) => {
    let response = await fetchAPI(
      "rest/api/3/filter",
      "GET",
      {},
      
      (response) => {
        res.json(
          response.text.map((elem) => {
            return { 
                name: elem.name ,
                jql: elem.jql
            };
          })
        );
      }
    );
  }
);

module.exports = router;
