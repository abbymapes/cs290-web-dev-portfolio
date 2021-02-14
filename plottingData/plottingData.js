/*
 * JavaScript file for Plotting Data 
 *
 * @author Abby Mapes
 */

var mymap = L.map('mapid').setView([0, 0], 3);
var jsonURL = "https://compsci290_2021spring.dukecs.io/resources/data/countries/factbook.json";

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWNtMTAzIiwiYSI6ImNrbDAxNXg5eDBtOWQydXQ0cmJvZ3VvMWgifQ.0jw976vCdyyms3YAd_l0IA'
}).addTo(mymap);

var layerGroup1 = L.layerGroup().addTo(mymap);
var layerGroup2 = L.layerGroup().addTo(mymap);
var layerGroup3 = L.layerGroup().addTo(mymap);
var layerGroup4 = L.layerGroup().addTo(mymap);
var layerGroup5 = L.layerGroup().addTo(mymap);

var layerList = [layerGroup1, layerGroup2, layerGroup3, layerGroup4, layerGroup5];

var carbonDict = {};
var latitudeDict = {};
var longitudeDict = {};
var countryClassification = {};
var populationDict = {};
var meanCarbonRate = 0;
var carbonRatePerLevel = 0;
var meanPopulation = 0;

var populationPerLevel = 0;
var populationOptions = [];
var displayedInitialPins = false;

function displayPins(jsonData) {
    if (!displayedInitialPins) {
        initializeMaps(jsonData);
        createKey();
        Object.entries(latitudeDict).forEach(function([country, latitude]) {
            var longitude = longitudeDict[country];
            var carbonLevel = carbonDict[country];
            var url = "";
            var size = [];

            if (carbonLevel <= carbonRatePerLevel) {
                url = icons.great;
                size = iconSize.great;
            } else if (carbonLevel <= carbonRatePerLevel * 2) {
                url = icons.good;
                size = iconSize.good;
            } else if (carbonLevel <= carbonRatePerLevel * 3) {
                url = icons.medium;
                size = iconSize.medium;
            } else if (carbonLevel <= carbonRatePerLevel * 4) {
                url = icons.bad;
                size = iconSize.bad;
            } else {
                url = icons.horrible;
                size = iconSize.horrible;
            }

            if (!countryClassification[url]) {
                countryClassification[url] = [country];
            } else {
                countryClassification[url].push(country);
            }
        
            var icon = new L.Icon({
                iconUrl: url,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: size,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            var countryPopulation = Math.round(populationDict[country] * 100) / 100;
            var layerGroup = layerGroup5;
            var carbonEmissions = Math.round(carbonLevel * 100) / 100;

            if (countryPopulation < populationOptions[0]) {
                layerGroup = layerGroup1;
            } else if (countryPopulation < populationOptions[1]) {
                layerGroup = layerGroup2;
            } else if (countryPopulation < populationOptions[2]) {
                layerGroup = layerGroup3;
            } else if (countryPopulation < populationOptions[3]) {
                layerGroup = layerGroup4;
            }
            
            var marker = L.marker([latitude, longitude], {icon: icon}).addTo(layerGroup);
            marker.bindPopup('<b>Name:</b> ' + country + '<br><b>Megatonnes of Carbon Dioxide Emissions per 100 people:</b> ' + carbonEmissions.toLocaleString() + '<br><b>Population:</b> ' + countryPopulation.toLocaleString());
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
        });
        createCountryList();
        displayedInitialPins = true;
    }
}

function initializeMaps(jsonData) {
    var sumCarbonRate = 0;
    var sumCountries = 0; 
    var sumPopulations = 0;

    Object.values(jsonData.countries).forEach(function(country) {
        var countryName = country.data.name;
        console.log(country.data);
        if (isValid(country)) {
            var carbonRate = (country.data.energy.carbon_dioxide_emissions_from_consumption_of_energy.megatonnes/country.data.people.population.total) * 100;
            carbonDict[countryName] = carbonRate;
            populationDict[countryName] = country.data.people.population.total;
            sumCarbonRate += carbonRate;
            sumCountries += 1;
            sumPopulations += country.data.people.population.total;
    
            var latMinutes = 0;
            if (country.data.geography.geographic_coordinates.latitude.minutes) {
                latMinutes = country.data.geography.geographic_coordinates.latitude.minutes/60;
            }
            if (country.data.geography.geographic_coordinates.latitude.hemisphere == "S") {
                latitudeDict[countryName] = -1 * (country.data.geography.geographic_coordinates.latitude.degrees + latMinutes);
            } else {
                latitudeDict[countryName] = country.data.geography.geographic_coordinates.latitude.degrees + latMinutes;
            }

            var longMinutes = 0;
            if (country.data.geography.geographic_coordinates.longitude.minutes) {
                longMinutes = country.data.geography.geographic_coordinates.longitude.minutes/60;
            }
            if (country.data.geography.geographic_coordinates.longitude.hemisphere == "W") {
                longitudeDict[countryName] = -1 * (country.data.geography.geographic_coordinates.longitude.degrees + longMinutes);
            } else {
                longitudeDict[countryName] = country.data.geography.geographic_coordinates.longitude.degrees + longMinutes;
            }
        }
    });
    
    meanCarbonRate = sumCarbonRate/sumCountries;
    carbonRatePerLevel = (meanCarbonRate * 2) / 5;
    meanPopulation = sumPopulations/sumCountries;
    populationPerLevel = (meanPopulation * 2) / 5;
    console.log(carbonDict);
    console.log(meanCarbonRate);
    console.log(populationPerLevel);

    [...Array(5).keys()].forEach(num => {
        populationOptions[num] = Math.round(populationPerLevel) * (num + 1);
    });
    console.log(populationOptions);

    
    var populationInput = document.createElement("form");
    var i = 1;
    populationOptions.forEach(level => {
        var input = document.createElement("input");
        input.type = "radio";
        input.id = "input-" + level;
        input.name = "population";
        input.value = level;
        input.addEventListener("click", setPopulation);
        var label = document.createElement("label");
        label.for = "input-" + level;

        var start = level - Math.round(populationPerLevel);
        var end = level;
        if (i != 1) {
            start += 1;
        }
        if (i == 5) {
            label.innerHTML = "<div class='numbers'> &ensp;" + start.toLocaleString() + "+ </div> people";
        } else {
            label.innerHTML = "<div class='numbers'> &ensp;" + start.toLocaleString() + " - " + end.toLocaleString() + " </div> people";
        }
        i += 1;

        var br = document.createElement("br");
        populationInput.appendChild(input);
        populationInput.appendChild(label);
        populationInput.appendChild(br);
    });
    var popDiv = document.getElementById('popInput');
    popDiv.appendChild(populationInput);

    var resetButton = document.createElement("button");
    resetButton.addEventListener("click", resetToAllPopulations);
    resetButton.innerText = "Reset to All Countries";
    popDiv.appendChild(resetButton);
}

function setPopulation() {
    var radios = document.getElementsByName('population');
    var selectedLayer = layerGroup5;
    radios.forEach(radio => {
        var countryPopulation = radio.value;
        var layerGroup = layerGroup5;
        if (countryPopulation == populationOptions[0]) {
            layerGroup = layerGroup1;
        } else if (countryPopulation == populationOptions[1]) {
            layerGroup = layerGroup2;
        } else if (countryPopulation == populationOptions[2]) {
            layerGroup = layerGroup3;
        } else if (countryPopulation == populationOptions[3]) {
            layerGroup = layerGroup4;
        } 

        if (radio.checked) {
            selectedLayer = layerGroup;
        }
    });
    
    layerList.forEach(layer => {
        mymap.removeLayer(layer);
    });
    mymap.addLayer(selectedLayer);
}

function resetToAllPopulations() {
    var radios = document.getElementsByName('population');
    radios.forEach(radio => {
        radio.checked = false;
    });
    layerList.forEach(layer => {
        mymap.removeLayer(layer);
        mymap.addLayer(layer);
    });
}

function createKey() {
    var start = 0;
    var end = Math.round(carbonRatePerLevel);
    var i = 1;
    var key = document.getElementById("legend");
    Object.values(icons).forEach(function(url) {
        var img = document.createElement("img");
        img.className = "legend-icon-" + i;
        img.src = url;
        var description = document.createElement("div");
        description.className = "legend-text";
        if (i == 5) {
            description.innerHTML = "<div class='numbers'> &ensp;" + start + " + </div> megatonnes of carbon dioxide emissions from consumption of energy per 100 people";
        } else {
            description.innerHTML = "<div class='numbers'> &ensp;" + start + " - " + end + " </div> megatonnes of carbon dioxide emissions from consumption of energy per 100 people";
        }
        if (i == 1) {
            start +=  Math.round(carbonRatePerLevel) + 1;
        } else {
            start +=  Math.round(carbonRatePerLevel);
        }
        end += Math.round(carbonRatePerLevel);
        i += 1;

        var row = document.createElement("tr");
        var pictureColumn = document.createElement("td");
        var textColumn = document.createElement("td");

        pictureColumn.appendChild(img);
        textColumn.appendChild(description);
        row.appendChild(pictureColumn);
        row.appendChild(textColumn);
        key.appendChild(row);
    });
}

function createCountryList() {
    var start = 0;
    var end = Math.round(carbonRatePerLevel);
    var i = 1;
    var list = document.getElementById("country-list");
    Object.entries(countryClassification).forEach(function([url, countries]) {
        var img = document.createElement("img");
        img.className = "legend-icon-" + i;
        img.src = url;
        var description = document.createElement("div");
        description.className = "legend-text";
        if (i == 5) {
            description.innerHTML = "<div class='numbers'> &ensp;" + start + " + </div> megatonnes of carbon dioxide emissions from consumption of energy per 100 people";
        } else {
            description.innerHTML = "<div class='numbers'> &ensp;" + start + " - " + end + " </div> megatonnes of carbon dioxide emissions from consumption of energy per 100 people";
        }
        if (i == 1) {
            start +=  Math.round(carbonRatePerLevel) + 1;
        } else {
            start +=  Math.round(carbonRatePerLevel);
        }
        end += Math.round(carbonRatePerLevel);
        i += 1;

        var row = document.createElement("tr");
        var pictureColumn = document.createElement("td");
        var textColumn = document.createElement("td");

        pictureColumn.appendChild(img);
        textColumn.appendChild(description);
        row.appendChild(pictureColumn);
        row.appendChild(textColumn);
        list.appendChild(row);

        var countryRow = document.createElement("tr");
        var emptyColumn = document.createElement("td");
        var nameColumn = document.createElement("td");
        nameColumn.innerHTML = countries.join(", &ensp;");
        countryRow.appendChild(emptyColumn);
        countryRow.appendChild(nameColumn);
        list.appendChild(countryRow);
    });
}

function isValid(country) {
    return (country.data.geography && 
            country.data.geography.geographic_coordinates && 
            country.data.geography.geographic_coordinates.latitude && 
            country.data.geography.geographic_coordinates.latitude.degrees && 
            country.data.geography.geographic_coordinates.longitude && 
            country.data.geography.geographic_coordinates.longitude.degrees && 
            country.data.energy && 
            country.data.energy.carbon_dioxide_emissions_from_consumption_of_energy && 
            country.data.energy.carbon_dioxide_emissions_from_consumption_of_energy.megatonnes && 
            country.data.people && 
            country.data.people.population && 
            country.data.people.population.total);
}

function fetchJSON () {
    // get data from the API AND
    fetch(jsonURL)
        // when it is done, convert response from JSON string to JavaScript data structure AND
        .then(response => response.json())
        // when it is done, display rsults on map
        .then(displayPins)
        // if there is an error, report it
        .catch(error => console.error(error));
}


// show markers when code is loaded
fetchJSON();
// run function again every 5 seconds
setInterval(fetchJSON, 5000);

