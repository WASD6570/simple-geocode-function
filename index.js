export default function main(datos, lat_usr, lng_usr, radio) {
  let map;
  let markers = [];
  let circle = [];

  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjqVdh9BHbgbibxpzTvunX3pSaLCieOhk&callback=initMap&libraries=visualization";
  script.async = true;

  // Append the 'script' element to 'head'
  document.head.appendChild(script);
  ///////////////////////////////////////////////////////////

  //funciones para determinar la distancia entre el input y los comercios

  //// funcion para pasar de grados a radianes

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  //// funcion para obtener la distancia entre 2 puntos

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  //funcion que devuelve un array con los comercios que estan dentro del radio deseado
  //y los marca en el mapa

  function distanceCalculator(
    lat_actual,
    lng_actual,
    radius,
    jsonComercios,
    attachMarker
  ) {
    const { comercios } = jsonComercios;
    const raw_array_of_comercios = comercios.map((comercio) => {
      if (
        getDistanceFromLatLonInKm(
          lat_actual,
          lng_actual,
          comercio.lat,
          comercio.lng
        ) <= radius
      ) {
        comercio.isOnRadius = true;
      } else comercio.isOnRadius = false;
      if (comercio.isOnRadius && attachMarker) {
        createMarker({ lat: comercio.lat, lng: comercio.lng });
        return comercio;
      }
      if (comercio.isOnRadius) {
        console.log("entre aca ");
        return comercio;
      }
    });
    // limpia el array de valores falsy
    return raw_array_of_comercios.filter((item) => item);
  }

  ///////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////

  // funciones helper relacionadas a la ubicacion del usuario y mapas

  // busca datos de geolocalizacion, prioriza los datos pasados a la funcion
  // main, si no encuentra datos pone una ubicacion por defecto
  function getLocalData(lat, lng) {
    if (lat && lng) {
      return { lat, lng };
    } else {
      const localData = localStorage.getItem("userLocation");
      const userLocation = localData
        ? JSON.parse(localData)
        : { lat: -30, lng: -60 };
      return userLocation;
    }
  }

  // crea un marcador y lo adjunta al mapa, es necesario tener una instancia de
  // un mapa. Tambien lo agrega al array de marcadores para poder ser removido
  // en el futuro

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

  // quita todos los markers del mapa y del array de markers

  function removeMarkers() {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    return;
  }

  // crea el radio de busqueda deseado, solo se puede tener 1 radio a la vez

  function createRadius(lat, lng, radius) {
    const radio = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: { lat, lng },
      radius: Number(radius) * 1000,
    });
    if (circle.length > 0) {
      circle[0].setMap(null);
      circle = [];
      circle.push(radio);
    } else circle.push(radio);
  }

  // funcione que pide la ubicacion al usuario, tiene como finalidad testear.
  // guarda la ubicacion en localStorage

  function setLocation() {
    navigator.geolocation.getCurrentPosition(
      (location) => {
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
  }

  // cambia la ubicacion del usuario, pensada para testear

  function changeLocation() {
    const form = document.getElementById("testform");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          lat: Number(e.target.lat.value),
          lng: Number(e.target.lng.value),
        })
      );
      window.location.reload();
    });
  }

  // inicializa el mapa en el dom, pone un marcador en la ubicacion del user
  // y de los comercios locales si estan dentro del radio

  window.initMap = function () {
    // JS API is loaded and available
    const userLocation = getLocalData(lat_usr, lng_usr);

    map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      zoom: 12,
    });
    new google.maps.Marker({
      position: {
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      map: map,
    });

    attachMarkersAndCircleToMap(
      userLocation.lat,
      userLocation.lng,
      radio,
      datos
    );
    changeLocation();
  };

  // adjunta los marcadores de los comercios dentro del radio deseado
  // y adjunta el radio deseado al mapa

  function attachMarkersAndCircleToMap(lat, lng, radius, data) {
    if (radius) {
      distanceCalculator(lat, lng, radius, data, true);
      createRadius(lat, lng, radius);
    }
    const form = document.getElementById("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setLocation();
      removeMarkers();
      distanceCalculator(lat, lng, e.target.radius.value, datos, true);
      createRadius(lat, lng, e.target.radius.value);
    });
  }

  // retorna los comercios que estan dentro del radio deseado
  return distanceCalculator(lat_usr, lng_usr, radio, datos, false);
}

//main()
