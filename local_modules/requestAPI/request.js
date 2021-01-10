const fetch = require("node-fetch");
const congit = require("config");
const {onError} = require('../logger/logger')

const domainPrefix = congit.get("domainPrefix");
const APItoken = congit.get("APItoken");
const emial = congit.get("emial");

function fetchAPI(
  path = "rest/api/3/project",
  method = "GET",
  body = {},
  onresponse = () => {},
  responseMessage = ""
) {
  let requestData = {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(emial + ":" + APItoken).toString(
        "base64"
      )}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (method !== "GET" && method !== "DELETE") {
    requestData.body = JSON.stringify(body);
  }

  fetch(`https://${domainPrefix}.atlassian.net/${path}`, requestData)
    .then((response) => {
      
      return response.text();
    })
    .then((text) => {
     
      if (text){
       
        return JSON.parse(text);
      }
    })
    .then((text) => {
      onresponse({text, responseMessage})
    return {text, responseMessage}
    })

  .catch((err) => onError(err, {path,requestData}));
}

module.exports = { fetchAPI };
