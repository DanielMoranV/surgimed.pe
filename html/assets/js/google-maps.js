function initMap() {
  // Latitude and Longitude
  var myLatLng = { lat: -4.8961879, lng: -80.694513 };

  var map = new google.maps.Map(document.getElementById("google-maps"), {
    zoom: 17,
    center: myLatLng,
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "Sucre 1204, Sullana", // Title Location
  });
}
