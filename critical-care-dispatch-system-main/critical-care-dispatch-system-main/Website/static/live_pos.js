var platform = new H.service.Platform({
  'apikey': 'zAymfjkXtJ8y6mErXuprXDZHICc1g5xlZyqjwt2GLqk'
  });
// Retrieve the target element for the map:
var targetElement = document.getElementById('map');

// Adding Hospitals  manually
function addMarkersToMap(map) {
  var hosp_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/covid-19-76/32/hospital_clinic_covid-19-512.png', {
    size: {w: 32, h: 32}
  });
  console.log(hosp_icon);
  var hospital1 = new H.map.Marker({lat:12.972986977391102, lng: 79.95154391275611}, {icon:hosp_icon});
  map.addObject(hospital1);

  var hospital2 = new H.map.Marker({lat:12.96939178992203, lng: 79.94553167510409}, {icon:hosp_icon});
  map.addObject(hospital2);

  var hospital3 = new H.map.Marker({lat:12.96885916513721, lng: 79.9518171962857}, {icon:hosp_icon});
  map.addObject(hospital3);

  var hospital4 = new H.map.Marker({lat:13.060750348925032, lng: 80.07485327522015}, {icon:hosp_icon});
  map.addObject(hospital4);

  var ambu_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/medical-line-33/32/medical_Ambulance-128.png', {
    size: {w: 32, h: 32}
  });
  var live = new H.map.Marker({lat:12.999007547373752, lng: 79.98152913677265}, {icon:ambu_icon});
  map.addObject(live);
}

// Get the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

let link = "https://cors-anywhere.herokuapp.com/https://7212-106-197-90-55.ngrok-free.app/positions";
// let link = "http://alloworigin.com/get?url=https://02ce-2402-3a80-42e-d1f7-22e0-17ff-fe06-3f76.ngrok-free.app/positions";

// Instantiate the map:
const map = new H.Map(
document.getElementById("map"),
defaultLayers.vector.normal.map,
{
  center: { lat: 12.999182811037375, lng: 79.98211265035837 },
  zoom: 15,
  pixelRatio: window.devicePixelRatio || 1,
}
);
window.addEventListener("resize", () => map.getViewPort().resize());
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

console.log("Finished setting up the Map");

window.onload = function () {
  addMarkersToMap(map);
}
// Initial fetch to get coordinates and add markers to the map
fetch(link, {
  headers: {
    'Origin': link, // Replace with your own domain
    'X-Requested-With': 'XMLHttpRequest',
    'ngrok-skip-browser-warning': 'true'
  }
})
.then((response) => response.json())
.then((data) => {
  console.log(data);
  const lat = data.lat;
  const lng = data.lng;
  var ambu_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/medical-line-33/32/medical_Ambulance-128.pngg', {
    size: {w: 32, h: 32}
  });
  const marker = new H.map.Marker({ lat: lat, lng: lng }, { icon: ambu_icon });
  console.log(lat, lng);
  map.addObject(marker);
  marker.setGeometry({ lat: lat, lng: lng }, {icon:ambu_icon});

  // Center map on the updated location
  map.setCenter({ lat: lat, lng: lng });

  // Update the marker every 5 seconds
  setInterval(() => {
    fetch(link, {
      headers: {
        'Origin': link, // Replace with your own domain
        'X-Requested-With': 'XMLHttpRequest',
        'ngrok-skip-browser-warning': 'true'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      const lat = data.lat;
      const lng = data.lng;
      var ambu_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/medical-line-33/32/medical_Ambulance-128.png', {
    size: {w: 32, h: 32}
  });
      console.log(lat, lng);
      // Update marker's position
      marker.setGeometry({ lat: lat, lng: lng }, {icon:ambu_icon});

      // Center map on the updated location
      map.setCenter({ lat: lat, lng: lng });
    })
    .catch((error) => console.error(error));

  }, 10000);
});
// .catch((error) => console.error(error));
