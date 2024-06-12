// location of the accident

alert("Accident In NH48")

// const accidentLocation = {lat: 12.986055831224892, lng: 79.9771987185742};
// const accidentLocation = {lat: 13.015841721865533, lng: 80.00537069339644};
const accidentLocation = {lat: 13.018545950975204, lng: 80.00115716996554};
const ambulanceLocations = [
    {lat: 13.017962753873656, lng: 79.98103800676671},
    {lat: 13.020750122959626, lng: 80.01449925061277},
    {lat: 13.003919360408847, lng: 79.92197097551312}
];
// This is for Long distance
// const ambulanceLocations = [
//     {lat: 13.036005881275289, lng: 80.04401150173163},
//     {lat: 12.974566599876834, lng: 80.04818938222202},
//     {lat: 12.935487499037047, lng: 79.93343233932634}
// ];

const hospitalCoords = [{lat: 0, lng: 0}];

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
// Create a platform object to communicate with the HERE Maps API
const platform = new H.service.Platform({
    apikey: 'zAymfjkXtJ8y6mErXuprXDZHICc1g5xlZyqjwt2GLqk'
});

// Instantiate the map:
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(
    document.getElementById("map"),
    defaultLayers.vector.normal.map,
    {
      center: { lat: 12.999182811037375, lng: 79.98211265035837 },
      zoom: 10,
      pixelRatio: window.devicePixelRatio || 1,
    }
);
window.addEventListener("resize", () => map.getViewPort().resize());
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);
window.onload = function () {
    addMarkersToMap(map);
    }

ambulanceLocations.forEach((ambulanceLocation) => {
    var ambu_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/medical-line-33/32/medical_Ambulance-128.png', {
    size: {w: 32, h: 32}
  });
    const ambulanceMarker = new H.map.Marker(ambulanceLocation, {icon:ambu_icon});
    map.addObject(ambulanceMarker);
});


var ambu_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/medical-line-33/32/medical_Ambulance-128.png', {
    size: {w: 32, h: 32}
  });
  var live = new H.map.Marker({ lat: 12.998946761872219, lng:  79.98164639051224 }, {icon:ambu_icon});
  map.addObject(live);


//distance between two points
function calculateDistance(point1, point2) {
    return point1.distance(point2);
}

// closest ambulance to the accident location
function findClosestAmbulance() {

    if (!ambulanceLocations || ambulanceLocations.length === 0) {
        return null;
    } else {
        let closestAmbulance;
        let closestDistance = Infinity;

        ambulanceLocations.forEach((ambulanceLocation) => {
            console.log(ambulanceLocation.lat, ambulanceLocation.lng);
            const distance = calculateDistance(new H.geo.Point(ambulanceLocation.lat, ambulanceLocation.lng), new H.geo.Point(accidentLocation.lat, accidentLocation.lng));

            if (distance < closestDistance) {
                closestDistance = distance;
                closestAmbulance = ambulanceLocation;
            }
        });

        return closestAmbulance;
    }
}


// Find the closest ambulance to the accident location
const closestAmbulance = findClosestAmbulance();
console.log(closestAmbulance)
var ambu_icon = new H.map.Icon('https://cdn1.iconfinder.com/data/icons/medical-line-33/32/medical_Ambulance-128.png', {
    size: {w: 32, h: 32}
  });
const ambulanceMarker = new H.map.Marker(closestAmbulance, {icon:ambu_icon});
map.addObject(ambulanceMarker);
  

// On result
var onResult = function(result, waypoints) {
    if (result.routes.length) {
        result.routes.forEach((route) => {
            route.sections.forEach((section) => {
                let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
                console.log("Line string", linestring);
                let routeLine = new H.map.Polyline(linestring, {
                    style: { strokeColor: 'blue', lineWidth: 3 }
                });
                map.addObject(routeLine);

                map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
            });
        });
    }
};


var routingParameters = {
    'routingMode': 'fast',
    'transportMode': 'car',
    'traffic':'enabled',
    'origin': closestAmbulance.lat + ',' + closestAmbulance.lng,
    'destination': '12.987503306128266,79.97930126022416',
    'return': 'polyline',
};



var router = platform.getRoutingService(null, 8);
    
router.calculateRoute(routingParameters, function(result) {
    onResult(result, routingParameters.waypoints);
}, function(error) {
    alert(error.message);
});

// to hospital

var onback = function(result, waypoints) {
    if (result.routes.length) {
        result.routes.forEach((route) => {
            route.sections.forEach((section) => {
                let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
                console.log("Line string", linestring);
                let routeLine = new H.map.Polyline(linestring, {
                    style: { strokeColor: 'red', lineWidth: 3 }
                });
                map.addObject(routeLine);

                map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
            });
        });
    }
};

var routingParam = {
    'routingMode': 'fast',
    'transportMode': 'car',
    'traffic':'enabled',
    'origin': '12.987503306128266,79.97930126022416',
    'destination': '12.972986977391102,79.95154391275611',
    'return': 'polyline',
};

// setInterval(router.calculateRoute(routingParam, onback,
//     function(error) {
//         alert(error.message);
//     }), 10000);


var clearRoute = function(){
    var objects = map.getObjects();
    for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    if (object instanceof H.map.Polyline) {
        map.removeObject(object);
    }
    }
};

router.calculateRoute(routingParam, onback,
        function(error) {
            alert(error.message);
        })


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("hospital1").addEventListener("click", function() {
        var routingParam = {
            'routingMode': 'fast',
            'transportMode': 'car',
            'traffic':'enabled',
            'origin': '12.987503306128266,79.97930126022416',
            'destination': '12.972986977391102,79.95154391275611',
            'return': 'polyline',
        };
        clearRoute();
        //to zone
        router.calculateRoute(routingParameters, function(result) {
            onResult(result, routingParameters.waypoints);
        }, function(error) {
            alert(error.message);
        });

        router.calculateRoute(routingParam, onback,
            function(error) {
                alert(error.message);
            })
    });
    
    document.getElementById("hospital2").addEventListener("click", function() {
        var routingParam = {
            'routingMode': 'fast',
            'transportMode': 'car',
            'traffic':'enabled',
            'origin': '12.987503306128266,79.97930126022416',
            'destination': '12.96939178992203,79.94553167510409',
            'return': 'polyline',
        };
        clearRoute();
        //to zone
        router.calculateRoute(routingParameters, function(result) {
            onResult(result, routingParameters.waypoints);
        }, function(error) {
            alert(error.message);
        });

        router.calculateRoute(routingParam, onback,
            function(error) {
                alert(error.message);
            })
    });
    
    document.getElementById("hospital3").addEventListener("click", function() {
        var routingParam = {
            'routingMode': 'fast',
            'transportMode': 'car',
            'traffic':'enabled',
            'origin': '12.987503306128266,79.97930126022416',
            'destination': '13.060750348925032,80.07485327522015',
            'return': 'polyline',
        };
        clearRoute();
        //to zone
        router.calculateRoute(routingParameters, function(result) {
            onResult(result, routingParameters.waypoints);
        }, function(error) {
            alert(error.message);
        });

        router.calculateRoute(routingParam, onback,
            function(error) {
                alert(error.message);
            })
    });
    });