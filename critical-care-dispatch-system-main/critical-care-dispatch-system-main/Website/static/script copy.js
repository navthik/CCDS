// Instantiate a map and platform object:
var platform = new H.service.Platform({
    'apikey': 'zAymfjkXtJ8y6mErXuprXDZHICc1g5xlZyqjwt2GLqk'
    });
    // Retrieve the target element for the map:
    var targetElement = document.getElementById('map');
    
    // Get the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();
    // Instantiate the map:
    const map = new H.Map(
            document.getElementById("map"),
            defaultLayers.vector.normal.map,
            {
            center: { lat: 12.999182811037375, lng: 79.98211265035837 },
            zoom: 13,
            pixelRatio: window.devicePixelRatio || 1,
            }
        );
        window.addEventListener("resize", () => map.getViewPort().resize());
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        const ui = H.ui.UI.createDefault(map, defaultLayers);

    //Marker Icon from ambulance
    var icon = new H.map.Icon('Website\static\ambulance.png');
    // Create the parameters for the routing request:
    var routingParameters = {
    'routingMode': 'fast',
    'transportMode': 'car',
    // The start point of the route:
    'origin': '10.82814654414503,77.06112273494166',
    // The end point of the route:
    'destination': '10.816293403340731,77.01789747586743',
    // Include the route shape in the response
    'return': 'polyline'
    };
    
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
    
    // Get an instance of the routing service version 8:
    var router = platform.getRoutingService(null, 8);
    
    // Call calculateRoute() with the routing parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    router.calculateRoute(routingParameters, onResult,
    function(error) {
        alert(error.message);
    });


    'origin': '12.99721939014156, 79.99754529296047',
    // The end point of the route:
    'destination': '12.967464662629121, 79.9458334669641',