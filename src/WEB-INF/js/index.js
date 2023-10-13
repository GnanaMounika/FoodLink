
var driverRoutesData;

function isLoggedIn() {
    var userName = localStorage.getItem('username');
    if(userName === null || userName === undefined) {
        window.location.href = "http://127.0.0.1:5500/carpool/login.html";
    }
}

isLoggedIn();

function initialize(){

  //The center location of our map.
  const coordinates = {lat: 37.3485345, lng: -121.9364432};
  var centerOfMap = new google.maps.LatLng(37.3485345,-121.9364432);

  var options = {
      center: centerOfMap,
      zoom: 13,
      mapTypeControl: true,
      mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
      }
  };

  //Create the map object.
  const driver_map = new google.maps.Map(document.getElementById('driver-map'), options);
  const driver_marker = new google.maps.Marker({
    position: coordinates,
    map: driver_map
  });
  const rider_map = new google.maps.Map(document.getElementById('rider-map'), options);
  const rider_marker = new google.maps.Marker({
    position: coordinates,
    map: rider_map
  });

  const trafficlayer = new google.maps.TrafficLayer();

  trafficlayer.setMap(driver_map);

  // Get element from which input should be taken
  var driver_from = document.getElementById('driver-from');
  var driver_to = document.getElementById('driver-to');
  var rider_from = document.getElementById('rider-from');
  var rider_to = document.getElementById('rider-to');

  // Initialize an object for the Google Maps Autocomplete API service (Since we have both origin and destination,
  // we will create two objects, one for each)
  driver_from_auto = new google.maps.places.Autocomplete(driver_from,
  {
      type: ['establishment'],
      componentRestrictions: {'country': ['US']},
      fields: ['place_id','geometry','name']
  });
  driver_to_auto = new google.maps.places.Autocomplete(driver_to,
  {
      type: ['establishment'],
      componentRestrictions: {'country': ['US']},
      fields: ['place_id','geometry','name']
  });
  rider_from_auto = new google.maps.places.Autocomplete(rider_from,
    {
        type: ['establishment'],
        componentRestrictions: {'country': ['US']},
        fields: ['place_id','geometry','name']
    });
  rider_to_auto = new google.maps.places.Autocomplete(rider_to,
  {
      type: ['establishment'],
      componentRestrictions: {'country': ['US']},
      fields: ['place_id','geometry','name']
  });
  

  // This will call "onPlaceChanged" function when an option from the dropdown suggestions is selected.
  // 'place_changed' is a value in google maps JavaScript API
  // autocomplete.addListener('place_changed', onOriginChanged);
  // autocomplete2.addListener('place_changed',onDestinationChanged);
}

// This line is responsible for loading this file and map on page.
  function changeNavigation(include) {
      var allowedNavigation = ["#driver", "#rider", "#upcoming", "#history"]
      allowedNavigation.forEach(element => {
          if(include == element) {
              $(element).css( "display", "flex" );
              $(element + "-nav").addClass("active");
              $(element + "-routes").css( "display", "none" );
              
          } else {
              $(element).css( "display", "none" );
              $(element + "-nav").removeClass("active");
          }
      })
  }
  
  changeNavigation("#driver");

google.maps.event.addDomListener(window, 'load', initialize);

function getCoordinatesForDriver() {
  var origin_place = driver_from_auto.getPlace();
  var destination_place = driver_to_auto.getPlace();
  var origin_lat = origin_place.geometry.location.lat();
  var origin_lng = origin_place.geometry.location.lng();
  var destination_lat = destination_place.geometry.location.lat();
  var destination_lng = destination_place.geometry.location.lng();
  var driver_coordinates = `${origin_lat},${origin_lng}/${destination_lat},${destination_lng}`;
  return driver_coordinates;
}

function getCoordinatesForRider() {
  var origin_place = rider_from_auto.getPlace();
  var destination_place = rider_to_auto.getPlace();
  var origin_lat = origin_place.geometry.location.lat();
  var origin_lng = origin_place.geometry.location.lng();
  var destination_lat = destination_place.geometry.location.lat();
  var destination_lng = destination_place.geometry.location.lng();
  var rider_coordinates = `${origin_lat},${origin_lng}/${destination_lat},${destination_lng}`;
  return rider_coordinates;
}

function getDirections() {
  var origin_place = driver_from_auto.getPlace();
  var destination_place = driver_to_auto.getPlace();
  var origin_lat = origin_place.geometry.location.lat();
  var origin_lng = origin_place.geometry.location.lng();
  var destination_lat = destination_place.geometry.location.lat();
  var destination_lng = destination_place.geometry.location.lng();

  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var origin_object = new google.maps.LatLng(origin_lat, origin_lng);
  var destination_object = new google.maps.LatLng(destination_lat, destination_lng);

  const map2 = new google.maps.Map(document.getElementById("driver-map"), {
    center: {lat: 37.7749, lng: -122.446747},
    zoom: 7,
    mapTypeControl: true,
    mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    position: google.maps.ControlPosition.TOP_CENTER,
    }
    
});
directionsRenderer.setMap(map2);

    var waypts = [];

    var points = driverRoutesData[Object.keys(driverRoutesData)[0]].points;
    for(var i = 0; i < driverRoutesData[Object.keys(driverRoutesData)[0]].points.length; i++) {
        console.log(points[i][1] + ", "+ points[i][0]);
        stop = new google.maps.LatLng(points[i][1], points[i][0])
        waypts.push({
            location: stop,
            stopover: false
        });
    }


var request = {
  origin: origin_object,
  destination: destination_object,
  waypoints: waypts,
  travelMode: google.maps.TravelMode["DRIVING"]
}
directionsService.route(request, function(response,status) {
  // If a direction is available, the status would return 'OK' and that means we can use the response to display the directions.
  if (status == "OK") {

      directionsRenderer.setDirections(response);

      // Creating object of DistanceMatrix to find the distance and duration of travelling from origin to destination.
      var distanceService = new google.maps.DistanceMatrixService();

      // getDistanceMatrix is a method which is responsible for calculating the distance and duration.
      distanceService.getDistanceMatrix({
          // in distance matrix, origin takes a list as a value.
          //list can be of latitude or longitude, name of place or place id.
          origins: [origin_object],
          //same goes with destination.
          destinations: [destination_object],
          // travelMode: google.maps.TravelMode["TRANSIT"],
          // unitSystem: google.maps.UnitSystem["METRIC"]
      }, (response,status) => {
          if (status == "OK") {
              var origins = response.originAddresses;
              var destinations = response.destinationAddresses;

              for (var i = 0; i < origins.length; i++) {
              var results = response.rows[i].elements;
              for (var j = 0; j < results.length; j++) {
                  var element = results[j];
                  var distance = element.distance.text;
                  var duration = element.duration.text;
                  }
              }
              
              var box = document.createElement('div');
              box.style.backgroundColor = '#ffffff';
              box.style.opacity = '0.8';
              
              var mydistance = document.createElement('h6');
              mydistance.innerHTML = 'Distance: ' + distance;
              var myduration = document.createElement('h6');
              myduration.innerHTML = 'Duration: ' + duration;

              box.appendChild(mydistance);
              box.appendChild(myduration);
              map.controls[google.maps.ControlPosition.TOP_LEFT].push(box);

          } else {
              window.alert(status)
          }
      });
  }
  // If a direction is not available (an invalid origin or destination is selected or entered by the user)
  // an error would be displayed.
  else {
      window.alert("Unable to find direction due to" + status);
  }
});
}

function makeRequest(uri, callback, event) {
  $.ajax({
      url: 'http://172.31.209.127:8080/allPossibleRoutes/' + uri,
      type: "GET",

      success: function (data) {
          callback(data, false, event);
      },

      error: function (error) {
          callback(error, true, event);
          console.log(`Error ${error}`);
      }
  });
}

function getWayPoints(event) {
    var uri = getCoordinatesForDriver();
    makeRequest(uri, parseResponse, event);
}

function parseResponse(response, isError, event) {
    console.log(response[Object.keys(response)[0]]);
    if(isError) {
        alert("Unable to get response from server");
    } else {
        $("#driver-routes").css( "display", "block" );
        $("#driver-form-div").css( "display", "none" );
        $("#driver-path-1-summary").text(response[Object.keys(response)[0]].summary);
        $("#driver-path-1-distance").text(response[Object.keys(response)[0]].totalDistance + " miles");
        $("#driver-path-1-time").text("Estimated Time " + response[Object.keys(response)[0]].travelTimeMinutes + " mins");
        $("#driver-path-1-speed").text(response[Object.keys(response)[0]].averageSpeed + " mph");
        driverRoutesData = response;

    }
    event.stopPropagation();
}

function driverRouteCancel() {
    $("#driver-routes").css( "display", "none" );
    $("#driver-form-div").css( "display", "block" );
}

function changeActiveForDriverRoute(id) {
    $(id).css("border", "2px solid #007bff");
    getDirections();
}

function logout() {
    localStorage.removeItem('username');
    window.location.href = "http://127.0.0.1:5500/carpool/login.html";
}

function storeDriverRoutes() {

    var driverCoordinates = getCoordinatesForDriver();
    var coords = driverCoordinates.split("/");

    var data = {
        "name": localStorage.getItem('username'),
        "routeId": Object.keys(driverRoutesData)[0],
        "License": "DL14CC0741",
        "startCoordinates": coords[0],
        "endCoordinates": coords[1]
    }


    var request = $.ajax({ 
        url: 'http://172.31.209.127:8080/saveRoute/', 
        headers: { 
            'Content-Type': 'application/json'
        }, 
        method: 'POST', 
        dataType: 'json', 
        data: data
    }); 
     
    request.done(function (msg) { 
        driverRouteCancel();
    }); 
     
    request.fail(function (jqXHR, textStatus) { 
        alert("Request failed: " + textStatus);
        //driverRouteCancel();
    }); 

}


function getRoutsForRider() {

    var driverCoordinates = getCoordinatesForRider();

    $.ajax({
        url: 'http://172.31.209.127:8080/getPersonalisedRides/' + driverCoordinates,
        type: "GET",
  
        success: function (data) {
            console.log(data);
        },
  
        error: function (error) {
            alert("Request failed: " + error);
        }
    });

}