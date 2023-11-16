document.addEventListener('DOMContentLoaded', getMyLocation);

let watchId = null;
let ourCoords = {
    latitude: 48.94321,
    longitude: 24.73380
};

let map = L.map('map').setView([48.94321, 24.73380], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker = L.marker([48.94321, 24.73380]).addTo(map);
marker.bindPopup("Your Location").openPopup();

let destinationMarker = null;

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, displayError);
        var watchButton = document.getElementById('watch');
        watchButton.onclick = watchLocation;
        var clearWatchButton = document.getElementById('clearWatch');
        clearWatchButton.onclick = clearWatch;

        map.on('click', function (e) {
            setDestinationMarker(e.latlng);
        });

        var scrollToDestButton = document.getElementById('scrollToDest');
        scrollToDestButton.onclick = scrollToDestination;
    } else {
        alert("Oops, no geolocation support");
    }
}

function displayLocation(position) {
    marker.setLatLng([position.coords.latitude, position.coords.longitude]);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let div = document.getElementById("location");
    div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`;
    div.innerHTML += `(with ${position.coords.accuracy} meters accuracy)`;
    let km = computeDistance(position.coords, ourCoords);
    let distance = document.getElementById("distance");
    distance.innerHTML = `You are ${km} km from the College`;

    addLocationMarker(position.coords);
}



        function displayError(error) {
            const errorTypes = {
                0: "Unknown error",
                1: "Permission denied by user",
                2: "Position is not available",
                3: "Request timed out"
            };
            let errorMessage = errorTypes[error.code];
            if (error.code == 0 || error.code == 2) {
                errorMessage = errorMessage + " " + error.message;
            }
            let div = document.getElementById("location");
            div.innerHTML = errorMessage;
        }

        function computeDistance(startCoords, destCoords) {
            let startLatRads = degreesToRadians(startCoords.latitude);
            let startLongRads = degreesToRadians(startCoords.longitude);
            let destLatRads = degreesToRadians(destCoords.latitude);
            let destLongRads = degreesToRadians(destCoords.longitude);
            let Radius = 6371;
            let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) *
                Math.cos(startLongRads - destLongRads)) * Radius;
            return distance;
        }

        function degreesToRadians(degrees) {
            let radians = (degrees * Math.PI) / 180;
            return radians;
        }

        function watchLocation() {
            watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
        }
        
        function clearWatch() {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                watchId = null;
            }
        }
        
        function addLocationMarker(coords) {
            let locationMarker = L.marker([coords.latitude, coords.longitude]).addTo(map);
            locationMarker.bindPopup(`Location: ${coords.latitude}, ${coords.longitude}<br>Time: ${new Date(coords.timestamp)}`).openPopup();
        }
        
        function setDestinationMarker(latlng) {
            if (destinationMarker) {
                map.removeLayer(destinationMarker);
            }
        
            destinationMarker = L.marker(latlng).addTo(map);
            destinationMarker.bindPopup(`Destination: ${latlng.lat}, ${latlng.lng}`).openPopup();
        }
        
        function scrollToDestination() {
            if (destinationMarker) {
                map.panTo(destinationMarker.getLatLng());
            } else {
                alert("Please set a destination first");
            }
        }

        var setDestButton = document.getElementById('setDestination');
        setDestButton.onclick = setDestinationFromInput;
        
        function setDestinationFromInput() {
            var latInput = document.getElementById('latInput').value;
            var lngInput = document.getElementById('lngInput').value;
        
            if (latInput && lngInput) {
                var destCoords = {
                    latitude: parseFloat(latInput),
                    longitude: parseFloat(lngInput)
                };
        
                setDestinationMarker(destCoords);
            } else {
                alert("Please enter both latitude and longitude");
            }
        }
        