function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 5,
    id: "light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 5,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 5,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });



  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Satellite": satmap,
    "Regular": OpenStreetMap_Mapnik,
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "World Imagery": Esri_WorldImagery
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "USGS Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [0.000000, 0.000000],
    zoom: 3,
    layers: [OpenStreetMap_Mapnik, earthquakes]

  });

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [-1,.9,1.9,2.9,3.9,4.9],
      labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function getColor(d) {
  return d < 1 ? '#309143' :
    d < 2 ? '#8ACE7E' :
      d < 3 ? '#FFDA66' :
        d < 4 ? '#E39802' :
          d < 5 ? '#FF684C' :
            '#B60A1C';
}



function createMarkers(response) {

  var markers = response.features;


  // Initialize an array to hold markers
  var originMarkers = [];

  // Loop through the markers array
  for (var index = 0; index < markers.length; index++) {
    var events = markers[index];
    coordinates = [events.geometry.coordinates[1], events.geometry.coordinates[0]]

    options = {
      radius: events.properties.mag * 4,
      fillColor: getColor(events.properties.mag),
      color: "black",
      weight: .5,
      opacity: 1,
      fillOpacity: 0.6
    }

    // For each record, create a marker and bind a popup with the earthquake data
    var originMarker = L.circleMarker(coordinates, options)
      .bindPopup("<h3>Location:" + events.properties.place + "</h3><h3>Magnitude: " + events.properties.mag + "</h3><h3 style='overflow-wrap: anywhere;'>Get More Info: " + "<a href=" + "'" + events.properties.url + "' target='_blank'>Click to Visit Site</a>" + "</h3>");

    // Add the marker to the originMarkers array
    originMarkers.push(originMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(originMarkers));
}


// Perform an API call to the Citi Bike API to get events information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
