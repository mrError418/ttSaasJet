const { fetchAPI } = require("./request");

// Знаю що можна балк, але ну його на...

/* const priority = {
  hard: "1",
  "~": "2",
  med: "3",
  "Low": "4",
  "Lowest": "5",
}; */

const priority = ["1", "2", "3", "4", "5"];
/*
const  types = {
    "0":"10001", //"Story":"10001",
    "1":"10002",  // "Task":"10002",
    "Bug":"10004",  // "Bug":"10004", 
    "Sub-task":"10003",  //   "Sub-task":"10003",
    "Epic":"10000",   //"Epic":"10000",
    "Spec-type😋":"10005",  //"Spec-type😋":"10005",
    "7-line":"10006",   //   "7-line":"10006",

}

*/
const types = [
  "10001", //"Story":"10001",
  "10002", // "Task":"10002",
  "10004", // "Bug":"10004",
  "10003", //   "Sub-task":"10003",
  "10000", //"Epic":"10000",
  "10005", //"Spec-type😋":"10005",
  "10006", //   "7-line":"10006",
];

const statuses = ["11", "21", "31", "51", "61"];
/* 
const  statuses = {
    "To do":"11",
    "To do dev":"21",
    "In Progress":"31",
    "QA":"51",
    "Sale":"61",
} */

let body = {
  update: {},
  fields: {
    summary: "Auto created issue",
    issuetype: {
      id: "10003",
    },
    parent: {
      id: "10008",
    },
    components: [
      {
        id: "10000",
      },
    ],
    project: {
      id: "10000",
    },
    description: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              text: "Order entry fails when selecting supplier.",
              type: "text",
            },
          ],
        },
      ],
    },
    reporter: {
      id: "5f3020fad0884f00494da511",
    },
    priority: {
      id: "5",
    },
    labels: ["bugfix", "blitz_test"],
    assignee: {
      id: "5f3020fad0884f00494da511",
    },
    customfield_10011: "Epic Name is required.",
  },
};

const issuesOwner = [
  "5f3020fad0884f00494da511",
  "5f3022079aa965004660903c",
  "5f301e40333edb0043561f12",
];
let status;

const data = [
  [2, 4, 0, 6, 2],
  [0, 2, 0, 1, 0],
  [1, 0, 0, 0, 0],
  [0, 0, 0, 2, 0],
  [1, 0, 32, 0, 0],
  [7, 3, 0, 33, 18],
  [8, 0, 0, 0, 4],
];
// statuses
for (const statusFromArray of statuses) {
  status = statusFromArray;
  // status = statuses[3];
  // user
  for (const user of issuesOwner) {
    body.fields.assignee.id = user;
    // body.fields.assignee.id = issuesOwner[1];

    //types
    for (const [i, v] of data.entries()) {
      body.fields.issuetype.id = types[i];
      //   body.fields.issuetype.id = types[0];
      delete body.fields.parent;
      delete body.fields["customfield_10011"];
      if (types[i] === "10003") {
        body.fields["parent"] = { id: "10008" };
      }

      if (types[i] === "10000") {
        body.fields["customfield_10011"] = "Epic Name is required.";
      }

      // priority
      for (const [index, value] of v.entries()) {
        body.fields.priority.id = priority[index];

        // number of issues
        for (let index = 0; index < value; index++) {
          //   if (types[i] === "10000")
          fetchAPI(
            "rest/api/3/issue",
            "POST",
            body,
            // responseHendler.bind(this)
            responseHendler,
            status
          );
        }
      }
    }
  }
}

function responseHendler(response) {
  let body2 = {
    historyMetadata: {
      update: {
        comment: [
          {
            add: {
              body: {
                type: "doc",
                version: 1,
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        text: "Bug has been fixed",
                        type: "text",
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
    transition: {
      id: "61",
    },
  };
  console.log(response.text);
  if (response.responseMessage !== "11" && response.responseMessage !== "") {
    console.log(`rest/api/3/issue/${response.text.id}/transitions`);
    body2["transition"]["id"] = response.responseMessage;
    console.log(body2);
    fetchAPI(`rest/api/3/issue/${response.text.id}/transitions`, "POST", body2);
  }
}
