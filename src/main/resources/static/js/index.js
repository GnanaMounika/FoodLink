
var driverRoutesData;

google.maps.event.addDomListener(window, 'load', initialize);



function initialize(){

  //The center location of our map.
  const coordinates = {lat: 37.3485345, lng: -121.9364432};
  var centerOfMap = new google.maps.LatLng(37.3485345,-121.9364432);

  var markerOptions = {
        center: centerOfMap,
        zoom: 13,
        showTooltip: true,
        showInfoWindow: true,
        useMapTypeControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        }
    };


  //Create the map object.
  const driver_map = new google.maps.Map(document.getElementById('driver-map'), markerOptions);
  const driver_marker = new google.maps.Marker({
    position: coordinates,
    map: driver_map
  });



  // Get element from which input should be taken
  var driver_from = document.getElementById('driver-from');
  driver_from_auto = new google.maps.places.Autocomplete(driver_from,
  {
      type: ['address'],
      componentRestrictions: {'country': ['US']},
      fields: ['place_id','geometry','name','postal_code']
  });

   getLocationPoints();
}

function getLocationPoints(){
    console.log("******** getLocationPoints");
    var origin_place = driver_from_auto.getPlace();

    const coordinates = {lat: 37.3485345, lng: -121.9364432};
    var centerOfMap = new google.maps.LatLng(37.3485345,-121.9364432);

    var markerOptions = {
          center: centerOfMap,
          zoom: 13,
          showTooltip: true,
          showInfoWindow: true,
          useMapTypeControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
          }
      };

     const contentString1 =
         '<div id="content">' +
         '<div id="siteNotice">' +
         "</div>" +
         '<h1 id="firstHeading" class="firstHeading">Santa Clara University</h1>' +
         '<div id="bodyContent">' +

         '<p>French Fries, Chicken Tender, Bread Rolls, Bagels' +
         "(last visited Jan, 2023).</p>" +
         "</div>" +
         "</div>";
     const contentString2 =
              '<div id="content">' +
                       '<div id="siteNotice">' +
                       "</div>" +
                       '<h1 id="firstHeading" class="firstHeading">Levis Stadium</h1>' +
                       '<div id="bodyContent">' +

                       '<p>Hot Dogs' +
                       "(last visited Dec, 2022).</p>" +
                       "</div>" +
                       "</div>";
     const contentString3 =
               '<div id="content">' +
              '<div id="siteNotice">' +
              "</div>" +
              '<h1 id="firstHeading" class="firstHeading">Great America amusement park</h1>' +
              '<div id="bodyContent">' +

              '<p>Ham Sandwiches, Pizza' +
              "(last visited Jan, 2023).</p>" +
              "</div>" +
              "</div>";
     const contentString4 =
                 '<div id="content">' +
                    '<div id="siteNotice">' +
                    "</div>" +
                    '<h1 id="firstHeading" class="firstHeading">Westfield Valley Fair shopping mall</h1>' +
                    '<div id="bodyContent">' +

                    '<p>cilantro line rice, Pinto Beans, guacamole' +
                    "(last visited Dec, 2022).</p>" +
                    "</div>" +
                    "</div>";
     const contentString5 =
                       '<div id="content">' +
                      '<div id="siteNotice">' +
                      "</div>" +
                      '<h1 id="firstHeading" class="firstHeading">San Jose Airport</h1>' +
                      '<div id="bodyContent">' +

                      '<p>Bagels, Croissants, Orange Juice' +
                      "(last visited Dec, 2022).</p>" +
                      "</div>" +
                      "</div>";

      const strings = [contentString1, contentString2, contentString3, contentString4, contentString5]
      const driver_map = new google.maps.Map(document.getElementById('driver-map'), markerOptions);
    const foodStops = [  [{ lat: 37.3541, lng: -121.9552 }, "Santa Clara University"],
    [{ lat: 37.3543, lng: -121.9692 }, "Levi's Stadium"],
    [{ lat: 37.3590, lng: -121.9719 }, "Great America amusement park"],
    [{ lat: 37.3661, lng: -121.9217 }, "Westfield Valley Fair shopping mall"],
    [{ lat: 37.3790, lng: -121.9436 }, "This Is constomized  information Mineta San Jose International Airport"]

  ];
        var infoWindow = new google.maps.InfoWindow({});
        var marker,i;
      for (i = 0; i < foodStops.length; i++) {

        var stop = foodStops[i];
        const infowindow = new google.maps.InfoWindow({
            content: strings[i],
            ariaLabel: stop[1],
          });
            marker = new google.maps.Marker({
              position: { lat: stop[0].lat, lng: stop[0].lng },
              map: driver_map,
              title: stop[1],
              options: markerOptions
            });
            //attachMsg(marker, strings[i]);


            marker.addListener("click", () => {
                infowindow.open({
                  anchor: marker,
                  driver_map,
                });
              });

      }

}

