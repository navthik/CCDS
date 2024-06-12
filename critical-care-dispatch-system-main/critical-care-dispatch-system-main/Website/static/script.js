// Instantiate a map and platform object:
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
  
    var acci_icon = new H.map.Icon('https://cdn3.iconfinder.com/data/icons/emergency-outline/432/car_accident_collision_crash_damage_traffic_vehicle_broken_injury_repair-512.png', {
        size: {w: 48, h: 48}
      });
    var accident = new H.map.Marker({lat:12.98762534857213, lng:79.97922834174226}, {icon:acci_icon});
    // var londonMarker = new H.map.Marker({lat:51.5008, lng:-0.1224});
    map.addObject(accident);
  }
    // Get the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();
    // Instantiate the map:
    const map = new H.Map(
            document.getElementById("map"),
            defaultLayers.vector.normal.map,
            {
            center: { lat: 12.997219, lng: 79.99754 },
            zoom: 13,
            pixelRatio: window.devicePixelRatio || 1,
            }
        );
        window.addEventListener("resize", () => map.getViewPort().resize());
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        const ui = H.ui.UI.createDefault(map, defaultLayers);
    window.onload = function () {
        addMarkersToMap(map);
        }

    //Marker Icon from ambulance
    var icon = new H.map.Icon('Website\static\ambulance.png');
    // Create the parameters for the routing request:
    // var routingParameters = {
    // 'routingMode': 'fast',
    // 'transportMode': 'car',
    // // The start point of the route:
    // 'origin': '12.99721939014156,79.99754529296047',
    // // The end point of the route:
    // 'destination': '12.967464662629121,79.9458334669641',
    // // Include the route shape in the response
    // 'return': 'polyline',
    // };
    // Define a callback function to process the routing response:
    var onResult = function(result) {
    // ensure that at least one route was found
    if (result.routes.length) {
        result.routes[0].sections.forEach((section) => {
            // Create a linestring to use as a point source for the route line
            let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
    
            // Create a polyline to display the route:
            let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 3 }
            });
    
            // Create a marker for the start point:
            let startMarker = new H.map.Marker(section.departure.place.location);
    
            // Create a marker for the end point:
            let endMarker = new H.map.Marker(section.arrival.place.location);
    
            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine, startMarker, endMarker]);
    
            // Set the map's viewport to make the whole route visible:
            map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
        });
    }
    };
    var routingParameters = {
        'routingMode': 'fast',
        'transportMode': 'car',
        // The start point of the route:
        'origin': '12.999385166666666,79.98172566666666',
        // The end point of the route:
        'destination': '12.96885916513721,79.9518171962857',
        'waypoints': [
            '13.01217209871936,79.99964559063554'
        ],        
        'return': 'polyline',
    };
    // Get an instance of the routing service version 8:
    var router = platform.getRoutingService(null, 8);
    
    router.calculateRoute(routingParameters, onResult,
        function(error) {
            alert(error.message);
        });
    
