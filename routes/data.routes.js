const { Router, request } = require("express");
const { logAction } = require("../local_modules/logger/logger");
const bodyParser = require("body-parser");
const { fetchAPI } = require("../local_modules/requestAPI/request");
const config = require("config");

const jqlBegin =
  "https://test-task-saas-jet.atlassian.net/browse/QB12345678-2054?jql=";
let generatedIssues = {};
let iterator = 1;
let result = 0;
const router = Router();
const today = new Date();

const statuses = {
  "3": '"In Progress"',
  "10000": '"To Do"',
  "10001": '"Selected for Development"',
  "10003": '"QA"',
  "10004": '"On Sale"',
};
const types = {
  "10001": '"Story"',
  "10002": '"Task"',
  "10004": '"Bug"',
  "10003": '"Sub-task"',
  "10000": '"Epic"',
  "10005": '"Spec-type😋"',
  "10006": '"7-line"',
};
const priorities = {
  "1": "Highest",
  "2": "High",
  "3": "Medium",
  "4": "Low",
  "5": "Lowest",
};

router.use(bodyParser.json());

// /api/data/issueData
router.get("/issueData/:filter", async (req, res) => {
  logAction("useFilter", { filter: req.params["filter"] });
  res.filter = req.params["filter"];

  fetchAPI(
    `/rest/api/3/search?${req.params["filter"]}`,
    "GET",
    {},
    // responseHendler.bind(this)
    loadData.bind(this, res)
  );
});

function loadData(...arguments) {
  //arguments[0].json(arguments[1]);

  let i = 0;
  iterator = arguments[1].text.total / 100;
  do {
    const step = i++ * 100;
    fetchAPI(
      `/rest/api/3/search?${arguments[0].filter}&maxResults=100&startAt=${step}`,
      "GET",
      {},
      // responseHendler.bind(this)
      generateRespData.bind(this, arguments[0], iterator)
    );
  } while (i < iterator);
}

function generateRespData(...arguments) {
  const res = arguments[0];
  const data = arguments[2];
  //console.log(arguments[1],arguments[2] ,"\n")

  for (issue of data.text.issues) {
    //count account ID
    if (issue.fields.assignee !== null && issue.fields.assignee !== undefined) {
      let accountId = issue.fields.assignee.accountId;

      if (generatedIssues[accountId] === undefined) {
        generatedIssues[accountId] = {};
      }

      //count status
      if (issue.fields.status !== null && issue.fields.status !== undefined) {
        let status = issue.fields.status.id;
        if (generatedIssues[accountId][status] === undefined) {
          generatedIssues[accountId][status] = {};
        }

        //count type
        if (
          issue.fields.issuetype !== null &&
          issue.fields.issuetype !== undefined
        ) {
          let type = issue.fields.issuetype.id;
          if (generatedIssues[accountId][status][type] === undefined) {
            generatedIssues[accountId][status][type] = {};
          }

          //count priority
          if (
            issue.fields.priority !== null &&
            issue.fields.priority !== undefined
          ) {
            let priority = issue.fields.priority.id;
            if (
              generatedIssues[accountId][status][type][priority] === undefined
            ) {
              generatedIssues[accountId][status][type][priority] = {};
            }

            // if Red flash

            if (
              issue.fields.duedate !== null &&
              issue.fields.duedate !== undefined
            ) {
              const duedate = new Date(issue.fields.duedate);
              const difference =
                (today.getTime() - duedate.getTime()) / (1000 * 3600 * 24);

              if (difference > 3) {
                generatedIssues[accountId][status][type][priority][
                  "isRed"
                ] = true;
              }
            }
            // if Yelow flash

            const createdAt = new Date(issue.fields.created);
            const difference =
              (today.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
            if (difference > 5) {
              generatedIssues[accountId][status][type][priority][
                "isYelow"
              ] = true;
            }

            if (
              generatedIssues[accountId][status][type][priority]["counter"] ===
              undefined
            ) {
              generatedIssues[accountId][status][type][priority]["counter"] = 1;

              generatedIssues[accountId][status][type][priority]["link"] =
                jqlBegin +
                encodeURIComponent(
                  `assignee =  ${accountId} AND status = ${statuses[status]} AND type = ${types[type]} AND priority = ${priorities[priority]}`
                );
            } else {
              generatedIssues[accountId][status][type][priority]["counter"]++;
            }
          }
        }
      }
    }
  }

  result++;
  if (result > arguments[1]) {
    res.json(generatedIssues);
    logAction("table was Generated", generatedIssues);
    iterator = 1;
    result = 0;
    generatedIssues = {};
  }
}

module.exports = router;
