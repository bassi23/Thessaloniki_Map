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
When the page is loaded, it will automatically call the function "drawmap()", which looks like this:

```javascript

function drawmap(){
    // Position and zoom on map
    var lon = 22.9612169;
    var lat = 40.6268430;
    var zoom = 13;

    map = new OpenLayers.Map('map', {
      projection: new OpenLayers.Projection("EPSG:900913"),
      displayProjection: new OpenLayers.Projection("EPSG:4326"),
      controls: [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.LayerSwitcher(),
        new OpenLayers.Control.PanZoomBar()
      ],
      maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
        20037508.34, 20037508.34),
      numZoomLevels: 18,
      maxResolution: 156543,
      units: 'meters'
    });


    layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layer_markers = new OpenLayers.Layer.Markers("Address", {
      projection: new OpenLayers.Projection("EPSG:4326"),
      visibility: true,
      displayInLayerSwitcher: false,
    });
    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);
        // Position of marker with popuptext
    addMarker(layer_markers, 22.9612169, 40.6268430, popuptext);
    }

```

The most important things to know here are the variable "popuptext" and the function "addMarker(layer_markers, lat, lon, popuptext)".

In popuptext you decide what should be displayed in the popup.Let's keep it simple with just 2 entries, time and temperature. You can add as many entries as you want with the same principle.


```javascript
  popuptext = "<font color=\"black\">Time: " + time[time.length - 1].toString() + "<br>Temperature = <a href='temperature.html'>" + temperature_history[temperature_history.length - 1].toString() + " °C</a></font>";
```

To get the newest values, you take the last entry of each array. For example time[time.length - 1]. To display it in the popuptext, you now also have to convert it into a string, by just adding ".toString()" at the end. You can add linebreaks with <br> and add links by the command   ```html  <a href='yourTargetSite.html'>   ``` . By clicking on that link you will be redirected to  yourTargetSite.html where we will be displaying all the data in a graph.


You can control the position of your marker with the popuptext with the function

addMarker(...)

To add more Markers, just call the function several times. For example:

```javascript
  popuptext1 = "<font color=\"black\">Time: " + time1[time.length - 1].toString() + "<br>Temperature = <a href='temperature1.html'>" + temperature_history1[temperature_history1.length - 1].toString() + " °C</a></font>";
  popuptext2 = "<font color=\"black\">Time: " + time2[time.length - 1].toString() + "<br>Temperature = <a href='temperature2.html'>" + temperature_history2[temperature_history2.length - 1].toString() + " °C</a></font>";
    // Position of marker with popuptext
    addMarker(layer_markers, 22.9612169, 40.6268430, popuptext1);
    addMarker(layer_markers, 22.961233, 40.626847, popuptext2);

```

When you are able to get the gps data, you can also add them in the addMarker function, instead of hardcoding them in.

That's it.


# Display the graph

When you are clicking on a link in the popupwindow, for example Temperature, you will be redirected to the file "temperature.html". If you look at the code, you see, that there a function called "draw()" is executed. Draw will be executed over and over again. 

```javascript
      <script type='text/javascript'>
        function draw() {
          for (let i = 0; i < 1000; i++) {
            stroke(255 - 255 * i / 1000, 255 - 255 * i / 1000, 255);
            line(0, i, width, i);
          }

          push();
          translate(width / 2, height / 2);
          rotate(3 * PI / 2);
          textSize(30);
          fill(0);
          noStroke();

          text("Temperature [°C]", 200, -460);


          pop();
          plot(temperature_history, 100, 100, 800, 600, true, true);
        }

      </script>
      
```

The most importat function in here is "plot()". Here you can define what values should be plotted. In this case "temperature_history". The next variables in that function are
1) "100" =  the left up corner of the graph is 100 Pixel to the right
2) "100" =  the left up corner of the graph is 100 Pixel away from the top
3) "800" =  the graph has a width of 800 pixels
4) "600" =  the graph has a height of 600 pixels
5) "true" =  the points are connected
6) "true" =  the plot is normalized

You can play a bit around with that options.
