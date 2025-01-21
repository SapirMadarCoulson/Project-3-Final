document.addEventListener('DOMContentLoaded', (event) => {
    // Function to read CSV file
    function fetchCSV(file, callback) {
        fetch(file)
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n');
                const headers = rows[0].split(',');
                const parksData = rows.slice(1).map(row => {
                    const values = row.split(',');
                    return headers.reduce((obj, header, index) => {
                        obj[header] = values[index];
                        return obj;
                    }, {});
                }).filter(row => row.ParkName && row.Year && row.RecreationVisitors); // Filter out any rows with missing data
                callback(parksData);
            });
    }

    // Function to group data by park and year
    function groupByParkYear(data) {
        const grouped = {};
        data.forEach(park => {
            const parkName = park.ParkName;
            if (!grouped[parkName]) grouped[parkName] = [];
            grouped[parkName].push({
                year: park.Year,
                visitors: parseInt(park.RecreationVisitors) || 0
            });
        });
        return grouped;
    }

    // Function to update plot for park visitors over years
    function updatePlot(parkName, groupedData) {
        const parkData = groupedData[parkName];
        const years = parkData.map(d => d.year);
        const visitors = parkData.map(d => d.visitors);

        const data = [{
            type: 'scatter',
            mode: 'lines+markers',
            x: years,
            y: visitors,
            line: { color: 'teal' },
            marker: { size: 8 }
        }];

        const layout = {
            title: `Visitors Over Years for ${parkName}`,
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: 'Number of Visitors',
                tickformat: ','
            },
            autosize: true
        };

        Plotly.newPlot('plotDiv', data, layout);
    }

    // Fetch CSV and process data for visitor chart
    fetchCSV('assets/Resources/allParksVisits.csv', (parksData) => {
        const groupedData = groupByParkYear(parksData);

        // Get all park names
        const parkNames = Object.keys(groupedData);

        // Populate dropdown with park names
        const dropdown = document.getElementById('parkSelector');
        if (dropdown) {
            parkNames.forEach(park => {
                const option = document.createElement('option');
                option.value = park;
                option.text = park;
                dropdown.appendChild(option);
            });

            // Event listener for park selection change
            dropdown.addEventListener('change', function() {
                updatePlot(this.value, groupedData);
            });

            // Show initial plot
            if (parkNames.length > 0) {
                updatePlot(parkNames[0], groupedData); // Default to the first park
            }
        } else {
            console.error("Dropdown element not found!");
        }
    });

    // Async function to read Excel file
    async function readExcelFile(filePath) {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Assuming data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        return sheetData;
    }

    // Function to process data for state acres
    function processData(data) {
        const stateTotals = {};

        data.forEach(row => {
            if (row.State && row["Gross Area Acres"]) {
                const state = row.State.trim();
                const acres = parseFloat(row["Gross Area Acres"]) || 0;
                stateTotals[state] = (stateTotals[state] || 0) + acres;
            }
        });

        // Sort states by total acres
        const sortedStates = Object.entries(stateTotals)
            .sort(([, acresA], [, acresB]) => acresB - acresA)
            .slice(0, 5); // Top 5 states

        // Prepare data for chart
        const states = sortedStates.map(([state]) => state);
        const acres = sortedStates.map(([, totalAcres]) => totalAcres);

        return { states, acres };
    }

    // Function to render the acres chart
    async function renderAcresChart() {
        const filePath = "assets/Resources/NPSAcreage-09-30-2024.xlsx";
        const rawData = await readExcelFile(filePath);
        const { states, acres } = processData(rawData);

        // Plot the data using Plotly
        const plotData = [{
            x: states,
            y: acres,
            type: "bar",
            marker: { color: "teal" }
        }];

        const layout = {
            title: "Top 5 States by Total National Park Acres",
            xaxis: { title: "State", tickangle: 45 },
            yaxis: { title: "Total Acres", tickformat: ",d" },
            margin: { t: 50, b: 100 },
            height: 500
        };

        Plotly.newPlot("acresPlot", plotData, layout);
    }

    // Initialize chart rendering for both charts
    renderAcresChart();
});