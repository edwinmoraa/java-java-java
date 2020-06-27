// from data.js
const tableData = data;
let tableMatch = null;

//set the reference to the table body and initialize
let tbody = d3.select("tbody");
let filtered = 0;

//fill in table by default
tableData.forEach(row => {
    tbody.append("tr");

    for (key in row){
        const cell = tbody.append("td");
        cell.text(row[key]);
    }
});

//define references to date field and the buttons
let dateField = d3.select("#datetime");
const button = d3.select("#filter-btn");
const reset = d3.select("#reset-btn");
const jsonDownload = d3.select("#download-json");
const csvDownload = d3.select("#donwload-csv");

//filter by date now
function filterDate(){
    //prevent refresh
    d3.event.preventDefault();

    //get the entered value
    let userDate = dateField.property("value");

    //filter only if user entered a date
    if(userDate){
        filtered = 1;

        //filter for observations with matching dates
        tableMatch = tableData.filter(obs => obs.datetime == userDate);

        //wipeout tbody to write out the new table
        tbody.html("");

        //fill in where the date matches the user input
        tableMatch.forEach(row => {
            tbody.append("tr");

            for (key in row){
                const cell = tbody.append("td");
                cell.text(row[key]);

            }
        });

    };
}

//reset to original display
fucntion resetData(){
    //prevent from refreshing again
    d3.event.preventDefault();

    //reset form
    document.forms['ufo-form'].reset()

    //error that table is not filtered
    filtered = 0;

    //wipeout tbody to write out the new table
    tbody.html("")

    //fill in where the date matches the user input
    tableData.forEach(row => {
        tbody.append("tr");

        for (key in row){
            const cell = tbody.append("td");
            cell.text(row[key]);


        }
    });
}

//download results as CSV
fucntion arrayToCSV(objArray){
    let csv = '';
    let header = Object.keys(objArray[0]).join(',');
    let values = objArray.map(o => Object.values(o).join(',')).join('\n');

    csv += header + '\n' + values;
    return csv;
}

//return to full or filtered table
function tableReturned(filtered_val){
    if(filtered_val){
        return tableMatch;
    } else {
        return tableData;
    }
}

//download query results as CSV
function downloadCSV(){
    let jsonFile = tableReturned(filtered);
    let csvDownloadFile = arrayToCSV(jsonFile);

    let blob = new Blob([csvDownloadFile], {
        type: "text/plain;charset=utf-8"
    });

    saveAs(blob, "ufo_sightings.json");
}

//define when user clicks on the button

button.on("click", filterDate);
reset.on("click", resetData);
jsonDownload.on("click", downloadJSON);
csvDownload.on("click", downloadCSV);

//allow the user to hit enter to filter by date
dateField.on("keyup", function(){
    if (d3.event.keyCode == 13){
        filterDate();
    }
})
