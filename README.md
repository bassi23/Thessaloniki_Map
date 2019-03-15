# Thessaloniki_Map

## How to use it
Just download the whole folder as .zip, and unzip it. The main page is called "index.html". Open it and you will see the main page with the map and the newest data from the sensor.

## How to get the sensor data

The sensor data is provided in JSON Format (JavaScript Object Notation) and can be accessed over an API Key. The code for that is in the file "sketch.js". We use the "p5.js" library, in which the functions preload() and loadJSON() is defined.

```javascript
let data;
let url = "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=40.626735&lng=22.961053&maxDistanceKM=1";
let apikey = "_______";

function preload(){
  data = loadJSON(url + "&apikey=" + apikey);
}
```
To load data from another sensor, just change the url or the API key. If you want to download the data from more sensors at the same time, you have to create another variable. For example:

```javascript
let data1;
let url1 = "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=40.626735&lng=22.961053&maxDistanceKM=1";
let apikey1 = "_______";

let data2;
let url2 = "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=40.626735&lng=22.961053&maxDistanceKM=1";
let apikey2 = "_______";

function preload(){
  data1 = loadJSON(url1 + "&apikey=" + apikey1);
  data2 = loadJSON(url2 + "&apikey=" + apikey2);
}
```

After the data is downloaded, ist has to be split up in the right data array. This is done in the function setup(), which is executed automatically after preload, and only once.

```javascript
//History data, initialization
let pm1_history = [];
let pm25_history = [];
let pm10_history = [];
let temperature_history = [];
let humidity_history = [];
let pressure_history = [];


//future data
let pm25_forecast = [];
let pm10_forecast = [];

function setup() {
  //split the data into the different categroies: Temperature, Humidity, Pressure, PM's
  for (let i = 0; i < data.history.length; i++) {
    pm1_history[i] = data.history[i].values[0].value;
    pm25_history[i] = data.history[i].values[1].value;
    pm10_history[i] = data.history[i].values[2].value;
    pressure_history[i] = data.history[i].values[3].value;
    humidity_history[i] = data.history[i].values[4].value;
    temperature_history[i] = data.history[i].values[5].value;
    time[i] = data.history[i].fromDateTime.substring(11, 16)
  }

  //For PM2.5 and PM10 there are also forecasts
  for (let i = 0; i < data.forecast.length; i++) {
    pm25_forecast[i] = data.forecast[i].values[0].value;
    pm10_forecast[i] = data.forecast[i].values[1].value;
  }
}

```
So now every data we have is stored in arrays.

## How to display data on the map as marker

Now, that we have all the data, we want to display it as popuptext and with a marker on the map. For that we use "Openstreetmaps". For the implementation of the map, you have to reference the source code of the map in the head of your HTML file "index.html".


```html
<!DOCTYPE html>
<html>
  <html lang="de">
    <meta charset="utf-8" />
    <head>
      <link rel="stylesheet" type="text/css" href="CSS/main.css" media="screen" />
      <script type='text/javascript' src='js/p5.min.js'></script>
      <script type='text/javascript' src='js/p5.dom.min.js'></script>
      <script type='text/javascript' src='js/tom.js'></script>
      <script type='text/javascript' src='js/sketch.js'></script>
      <script type='text/javascript' src='js/draw.js'></script>
      <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
      <link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css">
      <script type="text/javascript" src="http://www.openlayers.org/api/OpenLayers.js"></script>
      <script type="text/javascript" src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
    </head>

    <body onload="drawmap();">

      <div id="header">
      </div>
      <p>Data visualitation on maps </p>
      <div id="map">
      </div>
    </body>

  </html>

```
