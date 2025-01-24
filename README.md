# Project-3 | USA National Parks - Data Visualization
## Sapir Madar Coulson, Maha Pentakoa, Ana Garcia, Michael Villeda, Daniel Grimm
### Summary
Our goal for this project is to create plots, interactive visualizations, and an interactive globe that allows the user to access specific informations about National Parks such as number of visitors to each national park over the yars, total acreage of national parks in the 50 states, types of activities and learning topics at each park, park website and contact information, and using the interactive map to locate a park, look at the entrance fee, and being able to zoom in on a satellite view of the park to see the geographical area around it.

### Files in this repository and their functions:
- Index.html - this is our main hub for linking to our other visualizations. Each interactive button takes the user to other HTML files we created which link to specific visualizations.  These HTML files it links to are below.

  ![image](https://github.com/user-attachments/assets/0c05e08c-05c3-4349-88ae-1435aff0b8bf)

- Map.html - this is the visualization of an interactive globe using the Cesium library that allows the user to geolocate national parks.  The user can also remove layers by clicking checkboxes in a legend at the bottom of the page to remove types of parks that they don't wish to see on the map.  Also, the user can click on any icon on the map and use links to the Park's website as well as go to an informational page showing a lot of very specific data about the National Park which is pulled from a National Park Service API.

  ![image](https://github.com/user-attachments/assets/72a468d9-f19b-4af3-b10a-5c63fcff51ba)

  - assets/js/logic.cs - this is the main file that Map.html calls to run all the javascript code to fetch the API, generate the icons, and properly display the retrieved API data when called by the user in the interactive map.
  - table.html - this file is called in the logic.cs file above when the user clicks on the View Locatoion Details link on the map.html page.  It takes the user to a new tab and displays API-fetched data in a table format.

  ![image](https://github.com/user-attachments/assets/83f8399c-da56-4f56-a42c-62e259d57233)

- vistors.html - this file contains an interactive map showing the number of visitors over a 25 year timeframe.  There is a dropdown menu that allows the user to choose from all 474 parks in the API and display the respective vistitor information.  This is fetched via javascript from a CSV file downloaded from the NPS website. The second plot on this page pulls static data for acreages for the top 5 National Parks in the country by fetching this from an Excel file via javascript downloaded from the NPS website

  ![image](https://github.com/user-attachments/assets/bc4ee6d7-e0f1-4a20-a74b-36060bb5bc20)

- vistors-expanded.html - this file fetches data from the same CSV file downloaded from the NPS website to create 5 separate visualizations of data:
  - Total visitor numbers for all national parks over a 25 year period to show the visitor number trends

    ![image](https://github.com/user-attachments/assets/80e58e00-ba59-4280-95b5-5ce43b091147)

  - Top 10 Parks in the US based on Total Recreational Visitors

    ![image](https://github.com/user-attachments/assets/befd6d18-b4d6-4725-9e2b-7243eec53834)

  - Showing percentage of types of camping preferences (Tent, RV, and backcountry) as totals across all National Parks

    ![image](https://github.com/user-attachments/assets/964b593f-3311-4f81-968a-0372afb30032)

  - The same information of types of camping perferences as above but this time applied as a stacked bar chart and displaying only the top 5 parks based on visitors

    ![image](https://github.com/user-attachments/assets/15250d02-78f5-4ea1-9ad6-75c1e580b206)

  - The top 10 Parks with a stacked bar chart showing Recreational versus Non-Recreational visitors to the parks

    ![image](https://github.com/user-attachments/assets/dc6f9aac-b9b2-4318-98b6-2d6d13d4fd4e)

- tableauPark.html - this is an interactive pie chart created with tableau and edited with HTML and CSS to be visible and interactive on this html page.  It displays in an interactive pie chart the Recereational and Non-Recreational visitors to all National Parks wtih park names that are selectable and deselectable

    ![image](https://github.com/user-attachments/assets/7b542768-ca2f-4818-8088-e367f4c91152)

- tableauYear.html - this is a static plot showing total Recreational and Non-Recreational visitors to all National Parks over a 25 year timeframe.  This was created with tableau utilizing the database created from the aforementioned CSV file

    ![image](https://github.com/user-attachments/assets/a42f1d12-34dc-4e46-bfcd-f6f66d381cfe)

- SQL.sql - this is a SQL query generated in postgreSQL in order to create a database from both the CSV file downloaded directly from the NPS website but also from a CSV generated with javascript from the NPS API used to create the interactive 3D globe. This was to help us create an ERD to better understand and visualize the relationship between these tables to be able to create these complex data structurs with this volume of data

    ![image](https://github.com/user-attachments/assets/167ec857-15a7-4c39-b535-7af382092b42)

    ![image](https://github.com/user-attachments/assets/dbdc8220-9226-49e2-8d8d-c3cbe3b90ec3)

### Data Ethics Considerations:<br>
- The HTML and CSS templates and the associated files was downloaded from the website https://html5up.net/ and edited to fit our needs. All of the site templates on HTML5 UP are licensed under the Creative Commons Attribution 3.0 License, which means we can:
Use them for personal purposes, Use them for commercial purposes, Modify them however we like -  All for free.
- In our project on the national parks in the USA, which featured a 3D Earth model, we prioritized ethical considerations by exclusively using free and publicly available information. All data and resources were sourced from reputable platforms that allow public use, ensuring compliance with copyright and licensing terms. We credited these sources appropriately and adhered to their usage guidelines. Our approach ensured transparency, accessibility, and respect for intellectual property, while presenting accurate and unbiased information about the natural and cultural significance of national parks. This ethical framework allowed us to create a project that is both informative and respectful of the sources and audiences involved.

Data Sources:<br>
https://www.nps.gov/subjects/developer/api-documentation.htm<br>
https://www.nps.gov/subjects/lwcf/acreagereports.htm<br>
https://github.com/nationalparkservice/nps-api-samples<br>
https://html5up.net/

