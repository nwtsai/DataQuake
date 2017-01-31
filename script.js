$(document).ready(function() 
{  
    // Onclick for past day
    $("#past_day").click(function() 
    {
        transitionToData("Day");
    });

    // Onclick for past week
    $("#past_week").click(function() 
    {
        transitionToData("Week");
    });

    // Onlick for past month
    $("#past_month").click(function() 
    {
        transitionToData("Month");
    });
});

function transitionToData(timeInterval)
{
    $(".entire-container").hide();
    $("body").css("background-color","#e3cda4");
    $("#Description2").text("");
    var descrip1 = "Earthquake locations followed by their respective magnitudes within the past ";

    if (timeInterval === "Day")
    {
        $(".Title").text("Past Day");
        $("#Description1").text(descrip1 + "24 hours");
        getEarthquakeData("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson");
        $("#past_week").removeClass("active");
        $("#past_month").removeClass("active");
        $("#past_day").addClass("active");
    }
    else if (timeInterval === "Week")
    {
        $(".Title").text("Past Week");
        $("#Description1").text(descrip1 + "week");
        getEarthquakeData("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
        $("#past_day").removeClass("active");
        $("#past_month").removeClass("active");
        $("#past_week").addClass("active");
    }
    else if (timeInterval === "Month")
    {
        $(".Title").text("Past Month");
        $("#Description1").text(descrip1 + "month");
        getEarthquakeData("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson");
        $("#past_week").removeClass("active");
        $("#past_day").removeClass("active");
        $("#past_month").addClass("active");
    }
}

// Grabs the Earthquake data from the URL
function getEarthquakeData(url)
{
  var EARTHQUAKE_API = url;
  $.get(EARTHQUAKE_API)
    .done(function(res) 
    {
      // Output earthquakes to the page
      console.log(res);
      // simpleEarthquakeDisplay(res.features);

      // Handlebars getting template and getting data
      var source   = $("#earthquake-data").html();
      var template = Handlebars.compile(source);
      var html    = template(res.features);

      $(".earthquake-data-template").html(html);
    })
    .fail(function(error) 
    {
      // Do something with the error
    })

  // SAMPLE: Display the earthquake titles on the page
  function simpleEarthquakeDisplay(quakes) 
  {
    var container = $('#sample').empty();
    quakes.forEach(function(quake) 
    {
        var quakeEl = $('<li></li>')
        .text(quake.properties.title)
        .appendTo(container);
    });
  }
}
