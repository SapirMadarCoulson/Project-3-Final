CREATE TABLE "NationalParksData" (
    "longitude" float,
    "contacts" VARCHAR,
   	"directionsUrl" VARCHAR,
	"parkCode" VARCHAR,
	"description" VARCHAR,
	"directionsInfo" VARCHAR,
	"states" VARCHAR,
	"latitude" VARCHAR,
	"weatherInfo" VARCHAR,
	"latLong" VARCHAR,
	"fullName" VARCHAR PRIMARY KEY,
	"url" VARCHAR,
	"designation" VARCHAR,
	"name" VARCHAR
);

select * from "NationalParksData"

CREATE TABLE "allParksVisits" (
	"PK" VARCHAR PRIMARY KEY,
    "ParkName" VARCHAR ,
	"Year" INT,
    "RecreationVisitors" float,
	"NonRecreationVisitors" float,
	"RecreationHours" float,
	"NonRecreationHours" float,
	"ConcessionerLodging" float,
	"ConcessionerCamping" float,
	"TentCampers" float,
	"RVCampers" float,
	"Backcountry" float,
	"NonRecreationOvernightStays" float,
	"MiscellaneousOvernightStays" float    
);
select * from "allParksVisits"






