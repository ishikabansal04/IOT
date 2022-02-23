const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const ThingSpeakClient = require('thingspeakclient');
const client = new ThingSpeakClient({server:'http://localhost:3000'});
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// client.attachChannel(1661678, { readKey:"DEK0QVKPZZUV6NGW"}, function(err, res){
//     if(err){
//         console.log("Error Encountered");
//     }
//     else{
//         console.log(res);
//     }
// });

// console.log(client.getLastEntryInFieldFeed({id: 1661678}, {field:3}));

let temperature, pressure, altitude;

app.get("/", function(req, res){
    const url_temperature = "https://api.thingspeak.com/channels/1661678/fields/1.json?api_key=DEK0QVKPZZUV6NGW&results=10";
    const url_altitude = "https://api.thingspeak.com/channels/1661678/fields/3.json?api_key=DEK0QVKPZZUV6NGW&results=10";
    const url_pressure = "https://api.thingspeak.com/channels/1661678/fields/2.json?api_key=DEK0QVKPZZUV6NGW&results=10";


    https.get(url_temperature, function(response){
        response.on("data", function(data){
            const Data_temp = JSON.parse(data);
            console.log(Data_temp);
            temperature = Data_temp.feeds[1].field1;
            console.log(temperature);
        });
    });
    https.get(url_altitude, function(response){
        response.on("data", function(data){
            const Data_pressure = JSON.parse(data);

            pressure = Data_pressure.feeds[2].field2;
            console.log(pressure);
        });
    });
    https.get(url_pressure, function(response){
        response.on("data", function(data){
            const Data_alt = JSON.parse(data);

            altitude = Data_alt.feeds[0].field3;
            console.log(altitude);
        });
    });

    res.render("index",{
        temperatureField : temperature,
        pressureField : pressure,
        altitudeField : altitude
    });
    
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000 successfully!");
});
  