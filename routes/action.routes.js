const { Router } = require("express");
const bodyParser = require("body-parser");
const { logAction } = require("../local_modules/logger/logger");

const router = Router();

router.use(bodyParser.json());

// /api/action/
router.post(  "/",  async (req, res) => {
     logAction('go by link', {link : req.body.link})
     res.sendStatus(201)
  }
);

module.exports = router;
