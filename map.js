var script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjqVdh9BHbgbibxpzTvunX3pSaLCieOhk&callback=initMap&libraries=drawing";
script.async = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);
