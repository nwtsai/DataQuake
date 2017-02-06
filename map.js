var map;

function initMap() 
{
    map = new google.maps.Map(document.getElementById('map'), 
    {
        zoom: 2,
        center: {lat: 20, lng: 0},
        mapTypeId: 'terrain'
    });

    map.data.setStyle(function(feature) 
    {
        var magnitude = feature.getProperty('mag');
        return 
        {
            icon: getCircle(magnitude)
        };
    });
}

function getCircle(magnitude) 
{
    return 
    {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .2,
        scale: Math.pow(2, magnitude) / 2,
        strokeColor: 'white',
        strokeWeight: .5
    };
}

function eqfeed_callback(results) 
{
    map.data.addGeoJson(results);
}
