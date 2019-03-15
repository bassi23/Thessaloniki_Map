let data;
let url = "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=40.626735&lng=22.961053&maxDistanceKM=1";
let apikey = "85E4GYOCveUL5M6YaOYjgsm83AvzVYba";


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

let numberOfVals = 23;
//time
let time = [];



// load the json data from the sensor
function preload() {
  data = loadJSON(url + "&apikey=" + apikey);
}


// button, that leads you back to the main page
let back;




function setup() {
  back = createButton('Back');
  back.position(850, 800);
  back.size(100, 50);
  back.style('font-size', '30px');
  back.mousePressed(function() {
    location.href = "index.html";
  });
  createCanvas(1000, 1200);

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
  //Draw the map (see draw.js)
  drawmap();
}



function getPoints() {
  preload();
  setup();
}


//Plot the values in a graph
function plot(data, x, y, dx, dy, connect, normalize) {
  //To normalize the data: find the maximun. For a new range between 0 and 1, you also have to find the Minimum
  let yMax = max(data);
  let yMin = min(data);

  //draw a rectangle as background for your graph
  fill(255);
  stroke(0);
  rect(x, y, dx, dy);

  //label the graph
  noStroke();
  fill(0);
  textSize(16);
  let yMax2 = round(yMax + 5);
  let yMin2 = round(yMin - 5);
  let diff = yMax2 - yMin2;
  diff = round(diff / 5);
  textSize(24);
  if (normalize) {
    text(yMin2, x - 30, y + dy);
  } else {
    text(0, x - 30, y + dy);
  }
  text(yMax2, x - 30, y);

  let dy2 = 5 * dy / (yMax2 - yMin2);
  for (let i = 0; i < diff + 1; i++) {
    text(i * 5 + yMin2, x - 30, y + dy - i * dy2)
  }

  //grid in the graph
  stroke(200);
  for (let i = 1; i < 24; i++) {
    line(x, y + i * dy / 23, x + dx, y + i * dy / 23);
    line(x + i * dx / 23, y, x + i * dx / 23, y + dy);
  }
  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(30);
  text("time of day [h]", x + dx / 2, y + dy + 70);
  textSize(24);

  for (let i = 1; i < 7; i++) {
    text(time[4 * i - 1], x + i * dx / (6), y + dy + 30);
  }
  text(time[0], x, y + dy + 30);

  //draw the data points
  fill(255, 0, 0);
  noStroke();


  //If the data is normalized, the data is plotted in the range between maximum and minimum
  //if connect == true, the data points are connected

  if (normalize) {
    for (let i = 0; i < data.length; i++) {
      ellipse(x + dx * i / numberOfVals, y + dy - dy * (data[i] - yMin2) / (yMax2 - yMin2), 4, 4);
    }
    stroke(255, 0, 0);
    if (connect) {
      for (let i = 0; i < data.length - 1; i++) {
        line(x + dx * i / numberOfVals, y + dy - dy * (data[i] - yMin2) / (yMax2 - yMin2), x + dx * (i + 1) / numberOfVals, y + dy - dy * (data[i + 1] - yMin2) / (yMax2 - yMin2));
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      ellipse(x + dx * i / numberOfVals, y + dy - dy * data[i] / yMax2, 4, 4);
    }
    stroke(255, 0, 0);
    if (connect) {
      for (let i = 0; i < data.length - 1; i++) {
        line(x + dx * i / numberOfVals, y + dy - dy * data[i] / yMax2, x + dx * (i + 1) / numberOfVals, y + dy - dy * data[i + 1] / yMax2);
      }
    }
  }
}