mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});

// Create a default Marker and add it to the map.s
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates) //Listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<p>Exact location will be shown after booking</p>"
    )
  )
  .addTo(map);
