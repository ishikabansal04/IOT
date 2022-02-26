const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let temperature, pressure, altitude;

app.get("/", function(req, res){
    const url_temp = "https://api.thingspeak.com/channels/1661678/fields/1.json?api_key=DEK0QVKPZZUV6NGW&results=35&round=1";
    const url_altitude = "https://api.thingspeak.com/channels/1661678/fields/3.json?api_key=DEK0QVKPZZUV6NGW&results=20&round=2";
    const url_pressure = "https://api.thingspeak.com/channels/1661678/fields/2.json?api_key=DEK0QVKPZZUV6NGW&results=20&round=2";

    const temp_req = axios.get(url_temp);
    const altitude_req = axios.get(url_altitude);
    const pressure_req = axios.get(url_pressure);

    axios.all([temp_req, altitude_req, pressure_req]).then(axios.spread((...responses) => {
        temp_data = responses[0];
        altitude_data = responses[1];
        pressure_data = responses[2];


        // getValues(temp_data, altitude_data, pressure_data);

        // Temperature 
        for(let i = 0; i < temp_data.data.feeds.length; i++){
            if(temp_data.data.feeds[i].field1 !== null){
                console.log("Temperature " + i);
                temperature = temp_data.data.feeds[i].field1;
                break;
            }
        }

        // Pressure
        for (let i = 0; i < pressure_data.data.feeds.length; i++) {
            if (pressure_data.data.feeds[i].field2 !== null) {
                // console.log("Pressure " + i);
                pressure = pressure_data.data.feeds[i].field2;
                break;
            }
        }

        // Altitude
        for (let i = 0; i < altitude_data.data.feeds.length; i++) {
            if (altitude_data.data.feeds[i].field3 !== null) {
                // console.log("Altitude " + i);
                altitude = altitude_data.data.feeds[i].field3;
                break;
            }
        }

        //hPa to atm
        pressure = pressure * 0.0009869233;
        pressure = Math.round(pressure * 100) / 100;
        res.render("index", {
            temperatureField: temperature,
            pressureField: pressure,
            altitudeField: altitude
        });
    }))
        .catch(errors => {
            console.error(errors);
        });
});


// function getValues(temp_data, prss)


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000 successfully!");
});