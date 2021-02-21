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
    layers: [satmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var stations = response.features;
  console.log(stations)

  // Initialize an array to hold bike markers
  var originMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];
    coordinates = [station.geometry.coordinates[1], station.geometry.coordinates[0]]
    //console.log(coordinates)
    // For each record, create a marker and bind a popup with the earthquake data
    var originMarker = L.marker(coordinates)
      .bindPopup("<h3>Location:" + station.properties.place + "</h3><h3>Magnitude: " + station.properties.mag + "</h3><h3 style='overflow-wrap: anywhere;'>Get More Info: " + "<a href=" + "'" + station.properties.url +"' target='_blank'>Click to Visit Site</a>"+ "</h3>");

    // Add the marker to the originMarkers array
    originMarkers.push(originMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(originMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
