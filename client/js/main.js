const domain = "http://localhost:5000";

window.onload = function () {
  loadFilters();

  let filterSelectorLink = document.querySelector("#selectData");
  filterSelectorLink.onchange = generateTable;
};

async function generateTable() {
  document.querySelector("#loading").style.display = "block";
  document.querySelector(".DataTable").style.display = "none";

  let elem = document.querySelector("#selectData");
  let value = elem.options[elem.selectedIndex].getAttribute("jql");
  response = await fetch(domain + "/api/data/issueData/" + encodeURI(value));
  if (response.status === 200) {
    let result = await response.json();
    renderTable(result);
  }
}

function generateLine(data) {
  let line = "";
  let styles = "";

  for (let index = 1; index <=5; index++) {
    const element = data[index];

    if (element !== undefined) {
      if (element.isYelow === true) {
        styles = "background-color:yellow;";
      }
      if (element.isRed === true) {
        styles = "background-color:red;";
      }

      line += ` <th  style="width = 10px; height=10px; ${styles}"> <a href="${element.link}" ${styles} >${element.counter}</a> </th>`;
    } else {
      line += ` <th style="width = 10px; height=10px;">  ...  </th>`;
    }

    styles = "";
  }
  return line;
}

function generate2florTable(data) {
  let table = `<table class="insideTable"> 
  <tr>${generateLine(data["10006"])}</tr>
  <tr>${generateLine(data["10007"])}</tr>
<tr>${generateLine(data["10009"])}</tr>
<tr>${generateLine(data["10008"])}</tr>
<tr>${generateLine(data["10000"])}</tr>
<tr>${generateLine(data["10010"])}</tr>
<tr>${generateLine(data["10011"])}</tr>
  </table> `;

  return table;
}

function renderTable(data) {
  document.querySelector("#loading").style.display = "none";
  document.querySelector(".DataTable").style.display = "block";

  let elem = document.querySelector(".DataTable");
  let FilterResultString ='';

  for (const [keyAssigne, value] of Object.entries(data)) {
    FilterResultString += `
      <tr>
        <th>Assigne<br> (${keyAssigne})</th>
        <th style="line-height: 27px;"> 
        Story <br>
        Task <br>
        Bug <br>
        Sub_task <br>
        Epic <br>
        Spec_type <br>
        7-line
        
        </th>
        
       
        <th> ${generate2florTable(value[3])}</th>
        <th> ${generate2florTable(value[10003])}</th>
        <th> ${generate2florTable(value[10004])}</th>
        <th> ${generate2florTable(value[10006])}</th>
        <th> ${generate2florTable(value[10007])}</th>

      </tr>`;
  }
  console.log(FilterResultString);

  elem.innerHTML =
    `   
  
  <tr>
  <th colspan = "2"></th>
  <th>In Progress</th>
  <th>To Do</th>
  <th>Selected for Development</th>
  <th>QA</th>
  <th>On Sale</th>
  

</tr>
  <tr>
  <th>Assigne</th>
  <th>Type</th>
  <th><img src="/static/photos/Statuses.jpg" alt=""></th>
  <th><img src="/static/photos/Statuses.jpg" alt=""></th>
  <th><img src="/static/photos/Statuses.jpg" alt=""></th>
  <th><img src="/static/photos/Statuses.jpg" alt=""></th>
  <th><img src="/static/photos/Statuses.jpg" alt=""></th>
</tr>` + FilterResultString;
}

async function loadFilters() {
  let link = document.querySelector("#selectData");
  response = await fetch(domain + "/api/filter");

  if (response.status === 200) {
    link.innerHTML = "";
    let result = await response.json();

    result.forEach((element, index) => {
      if (index == 0) {
        link.innerHTML += `
    <option jql="${element.jql}" selected="selected"> ${element.name} </option>
    `;
      }
      link.innerHTML += `
        <option jql="${element.jql}"> ${element.name} </option>
        `;
    });
  }
}
