let coords = {
    latitude: 47.624851,
    longitude: -122.52099
}

function getMyLocation() {
    if (navigator.geolocation || 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(displayLocation, displayError)
    } else {
        alert("Oops, can't get position");
    }
}

function displayLocation(position) {
    console.log(position)
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let div = document.getElementById('location');
    div.innerHTML = `You are at latitude ${latitude}: longitude ${longitude} `;
    div.innerHTML += '(with ' + position.coords.accuracy + ' meters accuracy)'; // position.coords.accuracy is in meters

    let km = computeDistance(position.coords, coords);
    let distance = document.getElementById('distance');
    distance.innerHTML = "You are " + km + " km from the WickedlySmart HQ";

    showMap(position.coords);
}

function displayError(error) {
    let errorTypes = {
        0: 'unknown type',
        1: 'permission denied by user',
        2: 'position not available',
        3: 'Request timed Out'
    }

    let errorMessage = errorTypes[error.code];

    if (error.code === 0 || error.code === 2) {
        errorMessage += ' ' + error.message;
    }

    let div = document.getElementById('location');
    div.innerHTML = errorMessage;
}

// COMPUTE DISTANCE
function computeDistance(startCoords, destCoords) {
    let startLatRads = degreesToRads(startCoords.latitude);
    let startLongRads = degreesToRads(startCoords.longitude);
    let destLatRads = degreesToRads(destCoords.latitude);
    let destLongRads = degreesToRads(destCoords.longitude);

    let radius = 6371 // RADIUS OF THE EARTH IN KM

    let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads)) +
        Math.cos(startLatRads) * Math.cos(destLatRads) *
        Math.cos(startLongRads - destLongRads) * radius;

    return distance;
}

function degreesToRads(degrees) {
    let radians = (degrees * Math.PI) / 180;
    return radians;
}

/**
 * Google Maps Api
 */
let map;

function showMap(coords) {
    let googleLatAndLong = new google.maps.LatLng(latitude, longitude);

    let mapsOptions = {
        zoom: 10, // 0 - 21
        center: googleLatAndLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP // SATELLITE, HYBRID
    };

    let mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, mapsOptions);

    addMarker(map, googleLatAndLong, title, content);
}

/**
 * MARKER TO POINT LOCATION ON THE MAp
 */
/** */
function addMarker(map, latlong, title, content) {
    let markerOptions = {
        position: latlong,
        map: map,
        title: title,
        clickable: true
    };

    let marker = new google.maps.Marker(markerOptions);

    let infoWindowOptions = {
        content: content,
        position: latlong
    };

    let infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    google.maps.event.addEventListener(marker, 'click', function() {
        infoWindow.open(map);
    })
}
