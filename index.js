import distanceCalculator from "./distanceCalculator.js";
import jsonData from "./test.json" assert { type: "json" };

let map;
let markers = [];

window.initMap = function () {
  // JS API is loaded and available
  navigator.geolocation.getCurrentPosition(
    async (location) => {
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        })
      );
    },
    (error) => {
      window.alert("no pudimos obtener tu ubicacion");
    }
  );
  const localData = localStorage.getItem("userLocation");
  const userLocation = localData
    ? JSON.parse(localData)
    : { lat: -30, lng: -60 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: userLocation.lat,
      lng: userLocation.lng,
    },
    zoom: 8,
  });
  createMarker({
    lat: userLocation.lat,
    lng: userLocation.lng,
  });

  distanceCalculator(-30.632211, -67.471279, 1, jsonData);
};

function createMarker(latLngObject) {
  const marker = new google.maps.Marker({
    position: {
      lat: latLngObject.lat,
      lng: latLngObject.lng,
    },
    map: map,
  });
  markers.push(marker);
}

function removeMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  return;
}
