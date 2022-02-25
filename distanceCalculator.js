//funciones helper

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

//funcion main

export default function distanceCalculator(
  lat_actual,
  lng_actual,
  radius,
  jsonComercios
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
    }
    if (comercio.isOnRadius) {
      createMarker({ lat: comercio.lat, lng: comercio.lng });
      return comercio;
    }
  });
  // limpia el array de valores falsy
  return raw_array_of_comercios.filter((item) => item);
}
