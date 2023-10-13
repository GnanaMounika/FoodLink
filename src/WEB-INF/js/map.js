function initialize(){

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(23.037506263879862, 72.52325094533654);

    var options = {
        center: centerOfMap,
        zoom: 10,
        mapTypeControl: true,
        mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        }
    };

    //Create the map object.
    const map = new google.maps.Map(document.getElementById('map'), options);

    const trafficlayer = new google.maps.TrafficLayer();

    trafficlayer.setMap(map);

    // Get element from which input should be taken
    var input = document.getElementById('origin');
    var input2 = document.getElementById('destination');

    // Initialize an object for the Google Maps Autocomplete API service (Since we have both origin and destination,
    // we will create two objects, one for each)
    autocomplete = new google.maps.places.Autocomplete(input,
    {
        type: ['establishment'],
        componentRestrictions: {'country': ['IN']},
        fields: ['place_id','geometry','name']
    });
    autocomplete2 = new google.maps.places.Autocomplete(input2,
    {
        type: ['establishment'],
        componentRestrictions: {'country': ['IN']},
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
                includeView(include);
                
            } else {
                $(element).css( "display", "none" );
                $(element + "-nav").removeClass("active");
            }
        })
    }
    
    function includeView(include) {
        var includes = $(include + "-include")
        $.each(includes, function () {
            var file = 'views/' + include.substring(1) + '.html'
            $(this).load(file)
        })
    }
    
    changeNavigation("#driver");

google.maps.event.addDomListener(window, 'load', initialize);



