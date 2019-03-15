# Thessaloniki_Map

## How to use it
Just download the whole folder as .zip, and unzip it. The main page is called "index.html". Open it and you will see the main page with the map and the newest data from the sensor.

## How does the map get the sensor data?

The sensor data is provided in JSON Format (JavaScript Object Notation) and can be accessed over an API Key. The code for that is in the file "sketch.js":

```javascript
let data;
let url = "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=40.626735&lng=22.961053&maxDistanceKM=1";
let apikey = "_______";
```
