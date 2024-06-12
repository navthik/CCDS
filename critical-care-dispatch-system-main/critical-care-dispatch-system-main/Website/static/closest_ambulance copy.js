    // Initialize the HERE Maps API
    var platform = new H.service.Platform({
        apikey: 'zAymfjkXtJ8y6mErXuprXDZHICc1g5xlZyqjwt2GLqk'
    });

    var defaultLayers = platform.createDefaultLayers();
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

    // Add markers for the ambulance locations and the accident location
    var ambulanceLocations = [
        { lat: 13.017962753873656, lng:  79.98103800676671 },
        { lat: 13.020750122959626, lng: 80.01449925061277 },
        { lat: 12.992804049303112, lng: 79.9634557780698 }
    ];

    var accidentLocation = { lat: 12.986055831224892, lng: 79.9771987185742 };

    var ambulanceMarkers = [];
    ambulanceLocations.forEach(function(location) {
        var marker = new H.map.Marker(location);
        map.addObject(marker);
        ambulanceMarkers.push(marker);
    });

    var accidentMarker = new H.map.Marker(accidentLocation);
    map.addObject(accidentMarker);

    // Find the closest ambulance to the accident location
    var routingService = platform.getRoutingService();
    var closestAmbulance = null;
    var minDistance = Infinity;

    ambulanceLocations.forEach(function(location, index) {
        routingService.calculateRoute({
            'mode': 'fastest;car',
            'waypoint0': 'geo!' + accidentLocation.lat + ',' + accidentLocation.lng,
            'waypoint1': 'geo!' + location.lat + ',' + location.lng,
            'representation': 'display'
        }, function(result) {
            var distance = result.response.route[0].summary.distance;
            if (distance < minDistance) {
                minDistance = distance;
                closestAmbulance = ambulanceMarkers[index];
            }
        }, function(error) {
            console.error(error);
        });
    });

    // Display the route from the closest ambulance to the accident location
    routingService.calculateRoute({
        'mode': 'fastest;car',
        'waypoint0': 'geo!' + closestAmbulance.getPosition().lat + ',' + closestAmbulance.getPosition().lng,
        'waypoint1': 'geo!' + accidentLocation.lat + ',' + accidentLocation.lng,
        'representation': 'display'
    }, function(result) {
        var routeLine = new H.map.Polyline(result.response.route[0].shape, {
            style: { strokeColor: 'blue', lineWidth: 3 }
        });
        map.addObject(routeLine);
    }, function(error) {
        console.error(error);
    });