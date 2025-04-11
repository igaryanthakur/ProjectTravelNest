mapboxgl.accessToken = mapToken;

const initMap = () => {
  try {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 10, // starting zoom
    });

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
        )
      )
      .addTo(map);
  } catch (err) {
    console.error("Error initializing map:", err);
    document.getElementById("map").innerHTML =
      '<p class="text-danger">Failed to load map. Please try again later.</p>';
  }
};

initMap();
