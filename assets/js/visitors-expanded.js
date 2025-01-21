// Load CSV data
d3.csv("assets/Resources/allParksVisits.csv", d3.autoType).then(data => {
    // Data preprocessing
    const numericColumns = [
      "RecreationVisitors", "NonRecreationVisitors", "RecreationHours",
      "NonRecreationHours", "ConcessionerLodging", "ConcessionerCamping",
      "TentCampers", "RVCampers", "Backcountry",
      "NonRecreationOvernightStays", "MiscellaneousOvernightStays"
    ];
  
    // Convert numeric columns
    data.forEach(row => {
      numericColumns.forEach(col => {
        row[col] = typeof row[col] === 'string' ? parseInt(row[col].replace(/,/g, ""), 10) : row[col];
      });
  
      // Replace park name abbreviations
      row.ParkName = row.ParkName.replace(/NP/g, "National Park")
        .replace(/NHP/g, "National Historical Park")
        .replace(/MEM/g, "Memorial")
        .replace(/NMEM/g, "National Memorial");
    });
  
    // 1. Time Series Analysis
    const timeSeriesData = d3.group(data, d => d.Year);
    const years = Array.from(timeSeriesData.keys()).sort((a, b) => a - b);
    const recreationVisitors = years.map(year =>
      d3.sum(data.filter(d => d.Year === year), d => d.RecreationVisitors)
    );
  
    Plotly.newPlot("time-series", [
      {
        x: years,
        y: recreationVisitors,
        type: "scatter",
        mode: "lines+markers",
        name: "Recreation Visitors"
      }
    ], {
      title: "Yearly Recreation Visitors (All Parks)",
      xaxis: { title: "Year" },
      yaxis: { title: "Recreation Visitors" }
    });
  
    // 2. Top Parks by Visitors
    const topParks = Array.from(d3.rollup(
      data,
      v => d3.sum(v, d => d.RecreationVisitors),
      d => d.ParkName
    )).sort((a, b) => b[1] - a[1]).slice(0, 10);
  
    Plotly.newPlot("top-parks", [
      {
        x: topParks.map(d => d[0]),
        y: topParks.map(d => d[1]),
        type: "bar",
        name: "Recreation Visitors"
      }
    ], {
      title: "Top 10 Parks by Total Recreation Visitors",
      xaxis: { title: "Park Name", tickangle: 45 },
      yaxis: { title: "Total Recreation Visitors" }
    });
  
// 4. Camping Preferences
const totalCampingPreferences = {
    tent: d3.sum(data, d => d.TentCampers),
    rv: d3.sum(data, d => d.RVCampers),
    backcountry: d3.sum(data, d => d.Backcountry)
  };
  
  // Pie Chart for All Parks
  Plotly.newPlot("camping-preferences", [
    {
      labels: ["Tent Campers", "RV Campers", "Backcountry Campers"],
      values: [
        totalCampingPreferences.tent,
        totalCampingPreferences.rv,
        totalCampingPreferences.backcountry
      ],
      type: "pie",
      hole: 0.4
    }
  ], {
    title: "Total Camping Preferences Across All Parks"
  });

// Compute total recreation visitors by park
const totalRecreationVisitors = d3.rollup(
    data,
    v => d3.sum(v, d => d.RecreationVisitors),
    d => d.ParkName
);
  
// Determine the top 10 parks by total recreation visitors
const topParksByRecreation = Array.from(totalRecreationVisitors.entries())
    .sort((a, b) => b[1] - a[1]) // Sort in descending order
    .slice(0, 10) // Get the top 10 parks
    .map(d => d[0]); // Extract park names
  
console.log("Top 10 Parks by Recreation Visitors:", topParksByRecreation);

// Recreation vs. Non-Recreation Visitors (Stacked Bar Chart)
const recreationData = d3.rollup(
    data.filter(d => topParksByRecreation.includes(d.ParkName)), // Filter for top parks
    v => ({
      recreation: d3.sum(v, d => d.RecreationVisitors),
      nonRecreation: d3.sum(v, d => d.NonRecreationVisitors)
    }),
    d => d.ParkName
  );
  
  const recreationComparisonData = Array.from(recreationData.entries())
    .sort((a, b) => topParksByRecreation.indexOf(a[0]) - topParksByRecreation.indexOf(b[0])); // Maintain order
  
  Plotly.newPlot("recreation-vs-nonrecreation", [
    {
      x: recreationComparisonData.map(d => d[0]), // Park names
      y: recreationComparisonData.map(d => d[1].recreation), // Recreation visitors
      name: "Recreation Visitors",
      type: "bar",
      marker: { color: "lightgreen" }
    },
    {
      x: recreationComparisonData.map(d => d[0]), // Park names
      y: recreationComparisonData.map(d => d[1].nonRecreation), // Non-recreation visitors
      name: "Non-Recreation Visitors",
      type: "bar",
      marker: { color: "lightcoral" }
    }
  ], {
    title: "Top 10 Parks: Recreation vs Non-Recreation Visitors",
    barmode: "stack",
    xaxis: { title: "Park Name", tickangle: 45 },
    yaxis: { title: "Visitors" }
  });

// Camping Preferences by Top 10 Parks (Stacked Bar Chart)
const campingPreferences = d3.rollup(
    data.filter(d => topParksByRecreation.includes(d.ParkName)), // Filter for top parks
    v => ({
      tent: d3.sum(v, d => d.TentCampers),
      rv: d3.sum(v, d => d.RVCampers),
      backcountry: d3.sum(v, d => d.Backcountry)
    }),
    d => d.ParkName
  );
  
  const campingData = Array.from(campingPreferences.entries())
    .sort((a, b) => topParksByRecreation.indexOf(a[0]) - topParksByRecreation.indexOf(b[0])); // Maintain order
  
  Plotly.newPlot("camping-bar", [
    {
      x: campingData.map(d => d[0]), // Park names
      y: campingData.map(d => d[1].tent), // Tent campers
      name: "Tent Campers",
      type: "bar",
      marker: { color: "skyblue" }
    },
    {
      x: campingData.map(d => d[0]), // Park names
      y: campingData.map(d => d[1].rv), // RV campers
      name: "RV Campers",
      type: "bar",
      marker: { color: "orange" }
    },
    {
      x: campingData.map(d => d[0]), // Park names
      y: campingData.map(d => d[1].backcountry), // Backcountry campers
      name: "Backcountry Campers",
      type: "bar",
      marker: { color: "purple" }
    }
  ], {
    title: "Camping Preferences by Top 10 Parks (Based on Visitors)",
    barmode: "stack",
    xaxis: { title: "Park Name", tickangle: 45 },
    yaxis: { title: "Campers" },
    margin: {
        l: 50,
        r: 50,
        b: 150, // Increase this value for more space at the bottom
        t: 100,
        pad: 4
    }
  });

});

