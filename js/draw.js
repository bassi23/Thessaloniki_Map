var map;
var layer_mapnik;
var layer_tah;
var layer_markers;

function drawmap() {
  // Popup
  var popuptext = "no data";
  if (time.length > 0) { // if the data is loaded, display it as popup on the map
    popuptext = "<font color=\"black\">Time: " + time[time.length - 1].toString() + "<br>Temperature = <a href='temperature.html'>" + temperature_history[temperature_history.length - 1].toString() + " °C</a><br><br>Humidity = <a href='humidity.html'>" + humidity_history[temperature_history.length - 1].toString() + " %</a><br><br>Pressure = <a href='pressure.html'>" + pressure_history[temperature_history.length - 1].toString() + "  hPa</a><br><br>PM1 = <a href='pm1.html'>" + pm1_history[temperature_history.length - 1].toString() + "</a><br><br>PM 2.5 = <a href='pm25.html'>" + pm25_history[pm25_history.length - 1].toString() + " </a><br><br>PM 10 = <a href='pm10.html'>" + pm10_history[pm10_history.length - 1].toString() + " </a></font>";
    OpenLayers.Lang.setCode('de');

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
      icon: 'https://raw.githubusercontent.com/bassi23/Schadstoffkarte/master/img/SUSmobil_Logo.jpg'
    });
    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);



    // Position of marker with popuptext
    addMarker(layer_markers, 22.9612169, 40.6268430, popuptext);
  }
}