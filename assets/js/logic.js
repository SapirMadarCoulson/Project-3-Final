// Access Cesium Ion with my api key
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYTgyNjM5Ny0wOTc3LTQ2MzQtYmZhOC04YjkzMTgwNTkwODUiLCJpZCI6MjY5MzE3LCJpYXQiOjE3MzY5OTI1NDV9.BhvC1tYcm7aMtL-Etf7E1lxuT7VmTBgZoY1w8I_wI5E'; // Replace with your actual Cesium ion token

// Initialize the Cesium viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain(),
  baseLayerPicker: false,
  timeline: false,
  animation: false,
});

// Without this code, loading location data in a new tab was blocked due to Cesium security
// This sets the iframe security settings to allow to allow access to the API in new tabs
const iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0];
iframe.setAttribute(
  'sandbox',
  'allow-same-origin allow-scripts allow-popups allow-forms'
);

// Activate an info box to refresh the Cesium iframe to make sure the changes above are enabled
viewer.infoBox.frame.src = 'about:blank';

// API and park website URL setup to fetching the API data
const apiKey = 'Z4ZXb0nUnTMOq6cljxbN1cFD0mk6kLaQBzkqehf3';
const parksUrl = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${apiKey}`;

// Create lists for each location type entity to store each entity which can be removed with toggle checkboxes
const parkEntities = [];
const monumentEntities = [];
const memorialEntities = [];

// Fetch park data from National Park Service API
fetch(parksUrl)
  .then((response) => response.json())
  .then((data) => {
    if (data.data && Array.isArray(data.data)) {
      // Loop through each location in the API from the National Park Service
      data.data.forEach((park) => {
        // Store data we want to show in variables to be called later
        const lat = parseFloat(park.latitude);
        const lon = parseFloat(park.longitude);
        const parkName = park.fullName;
        const entranceFee = park.entranceFees.map((fee) => fee.cost);
        const entrancePass = park.entrancePasses.map((fee) => fee.cost);
        const parkUrl = park.url;
        const parkCode = park.parkCode;

        // I added this code because I had to check to make sure the entrance fee was a valid number
        const feeAmount = parseFloat(entranceFee[0]) || 0;

        // Assign the proper color of the Park Tree icon based on the range of Entrance Fee Amount
        let parkIconUrl;
        if (feeAmount === 0) {
          parkIconUrl = 'images/tree-green.svg';
        } else if (feeAmount > 0 && feeAmount <= 10) {
          parkIconUrl = 'images/tree-yellow.svg';
        } else if (feeAmount > 10 && feeAmount <= 20) {
          parkIconUrl = 'images/tree-orange.svg';
        } else if (feeAmount > 20) {
          parkIconUrl = 'images/tree-red.svg';
        }

        // Assign the proper color of the Monument icon based on the range of Entrance Fee Amount
        let monumentIconUrl;
        if (feeAmount === 0) {
          monumentIconUrl = 'images/monument-green.svg';
        } else if (feeAmount > 0 && feeAmount <= 10) {
          monumentIconUrl = 'images/monument-yellow.svg';
        } else if (feeAmount > 10 && feeAmount <= 20) {
          monumentIconUrl = 'images/monument-orange.svg';
        } else if (feeAmount > 20) {
          monumentIconUrl = 'images/monument-red.svg';
        }

        // Assign the proper color of the Memorial icon based on the range of Entrance Fee Amount
        let memorialIconUrl;
        if (feeAmount === 0) {
          memorialIconUrl = 'images/memorial-green.svg';
        } else if (feeAmount > 0 && feeAmount <= 10) {
          memorialIconUrl = 'images/memorial-yellow.svg';
        } else if (feeAmount > 10 && feeAmount <= 20) {
          memorialIconUrl = 'images/memorial-orange.svg';
        } else if (feeAmount > 20) {
          memorialIconUrl = 'images/memorial-red.svg';
        }

        // Test if the resulting location is a National Park and is also not a Monument
        // Add the icon to the Cesium globe and create a popup when the user clicks on it
        if (
          !park.designation.includes('Monument') &&
          park.designation.includes('Park')
        ) {
          const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            billboard: {
              image: parkIconUrl,
              width: 32,
              height: 32,
            },
            description: `
              <h3>${parkName}</h3>
              <p>Entrance fee: ${entranceFee[0] || 'None'}</p>
              <p>Annual Pass fee: ${entrancePass[0] || 'None'}</p>
              <br><br><a href="${parkUrl}" target="_blank">Location Website</a>
              <br><br><a href="table.html?parkCode=${parkCode}" target="_blank">View Location Details</a>
          `,
          });

          // Store the resulting park entity and push it to the parkEntities list
          parkEntities.push(entity);
        }

        // Test if the resulting location is a National Monument
        // Add the icon to the Cesium globe and create a popup when the user clicks on it
        if (park.designation.includes('Monument')) {
          const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            billboard: {
              image: monumentIconUrl,
              width: 26,
              height: 26,
            },
            description: `
              <h3>${parkName}</h3>
              <p>Entrance fee: ${entranceFee[0] || 'None'}</p>
              <p>Annual Pass fee: ${entrancePass[0] || 'None'}</p>
              <br><br><a href="${parkUrl}" target="_blank">Location Website</a>
              <br><br><a href="table.html?parkCode=${parkCode}" target="_blank">View Location Details</a>
          `,
          });

          // Store the resulting monument entity and push it to the monumentEntities list
          monumentEntities.push(entity);
        }

        // Test if the resulting location is a National Monument
        // Add the icon to the Cesium globe and create a popup when the user clicks on it
        if (
          park.designation.includes('Memorial') &&
          !park.designation.includes('Monument')
        ) {
          const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            billboard: {
              image: memorialIconUrl,
              width: 32,
              height: 32,
            },
            description: `
              <h3>${parkName}</h3>
              <p>Entrance fee: ${entranceFee[0] || 'None'}</p>
              <p>Annual Pass fee: ${entrancePass[0] || 'None'}</p>
              <br><br><a href="${parkUrl}" target="_blank">Location Website</a>
              <br><br><a href="table.html?parkCode=${parkCode}" target="_blank">View Location Details</a>
          `,
          });

          // Store the resulting memorial entity and push it to the memorialEntities list
          memorialEntities.push(entity);
        }
      });
    } else {
      console.error('Invalid data structure:', data); // Test for invalid data error
    }
  })
  .catch((error) => console.error('Error fetching data:', error)); // Display an error if the API can't be accessed

// Add a legend for Entrance Fees and show the associated color next to each
const legendContainer = document.createElement('div');
legendContainer.style.position = 'absolute';
legendContainer.style.bottom = '35px';
legendContainer.style.left = '10px';
legendContainer.style.padding = '10px';
legendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
legendContainer.style.border = '1px solid #ccc';
legendContainer.innerHTML = `
  <h4>Entrance Fees</h4>
  <div style="display: flex; align-items: center; margin-bottom: 8px;">
    <div style="width: 16px; height: 16px; background-color: green; margin-right: 8px;"></div>
    Free ($0)
  </div>
  <div style="display: flex; align-items: center; margin-bottom: 8px;">
    <div style="width: 16px; height: 16px; background-color: yellow; margin-right: 8px; border: 1px solid #ccc;"></div>
    $1 - $10
  </div>
  <div style="display: flex; align-items: center; margin-bottom: 8px;">
    <div style="width: 16px; height: 16px; background-color: orange; margin-right: 8px;"></div>
    $11 - $20
  </div>
  <div style="display: flex; align-items: center;">
    <div style="width: 16px; height: 16px; background-color: red; margin-right: 8px;"></div>
    $21 and above
  </div>
`;
document.body.appendChild(legendContainer);

// Add a second layer to show Location types as well as their associated Icons
const parkTypeLegendContainer = document.createElement('div');
parkTypeLegendContainer.style.position = 'absolute';
parkTypeLegendContainer.style.bottom = '35px';
parkTypeLegendContainer.style.left = '170px';
parkTypeLegendContainer.style.padding = '10px';
parkTypeLegendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
parkTypeLegendContainer.style.border = '1px solid #ccc';

// Add checkboxes next to each type of location that can be deselected by the user to remove it from the globe
parkTypeLegendContainer.innerHTML = `
  <h4>Location Types<br>(Use checkboxes to toggle on/off the map)</h4>
  <div style="display: flex; align-items: center; margin-bottom: 8px;">
    <img src="images/tree-green.svg" style="width: 22px; height: 22px;" />
    <label for="toggleParks" style="margin-right: 15px;">National Park</label>
    <input type="checkbox" id="toggleParks" checked style="margin-right: 8px;" />
  </div>
  <div style="display: flex; align-items: center; margin-bottom: 8px;">
    <img src="images/monument-green.svg" style="width: 22px; height: 22px;" />
    <label for="toggleMonuments" style="margin-right: 15px;">National Monument</label>
    <input type="checkbox" id="toggleMonuments" checked style="margin-right: 8px;" />
  </div>
  <div style="display: flex; align-items: center;">
    <img src="images/memorial-green.svg" style="width: 22px; height: 22px;" />
    <label for="toggleMemorials" style="margin-right: 15px;">National Memorial</label>
    <input type="checkbox" id="toggleMemorials" checked style="margin-right: 8px;" />
  </div>
`;

document.body.appendChild(parkTypeLegendContainer);

// Event listener for the National Park checkbox to add/remove the park icons from the map when the user clicks it
document.getElementById('toggleParks').addEventListener('change', (e) => {
  parkEntities.forEach((entity) => {
    entity.show = e.target.checked;
  });
});

// Event listener for the National Monument checkbox to add/remove the nonument icons from the map when the user clicks it
document.getElementById('toggleMonuments').addEventListener('change', (e) => {
  monumentEntities.forEach((entity) => {
    entity.show = e.target.checked;
  });
});

// Event listener for the National Memorial checkbox to add/remove the memorial icons from the map when the user clicks it
document.getElementById('toggleMemorials').addEventListener('change', (e) => {
  memorialEntities.forEach((entity) => {
    entity.show = e.target.checked;
  });
});
