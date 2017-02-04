$(document).ready(function() 
{  
    // Onclick for past day
    $("#past_day").click(function() 
    {
        $('.maplink').remove();
        transitionToData("Day");
    });

    // Onclick for past week
    $("#past_week").click(function() 
    {
        $('.maplink').remove();
        transitionToData("Week");
    });

    // Onlick for past month
    $("#past_month").click(function() 
    {
        $('.maplink').remove();
        transitionToData("Month");
    });
});

function transitionToData(timeInterval)
{
    $(".entire-koala").hide();
    $("body").css("background-color","#e3cda4");
    $("#Description2").text("");
    var descrip1 = "Earthquake locations followed by their respective magnitudes within the past ";
    var descrip2 = "Each circle on the map indicates one earthquake, and the larger the magnitude of the quake, the larger the radius.";

    if (timeInterval === "Day")
    {
        $(".Title").text("Past Day");
        $("#Description1").text(descrip1 + "24 hours. " + descrip2);
        getEarthquakeData("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson");
        $("#past_week").removeClass("active");
        $("#past_month").removeClass("active");
        $("#past_day").addClass("active");
    }
    else if (timeInterval === "Week")
    {
        $(".Title").text("Past Week");
        $("#Description1").text(descrip1 + "week. " + descrip2);
        getEarthquakeData("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
        $("#past_day").removeClass("active");
        $("#past_month").removeClass("active");
        $("#past_week").addClass("active");
    }
    else if (timeInterval === "Month")
    {
        $(".Title").text("Past Month");
        $("#Description1").text(descrip1 + "month. " + descrip2);
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
      // Output earthquake data to the console
      console.log(res);
      setTimeout(function(){eqfeed_callback(res);
      }, 500);
      console.log("done");

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
}

// Converts a UNIX timestamp to a standard calendar date by creating a helper function for Handlebars.js
Handlebars.registerHelper("convertTime", function(UNIX_timestamp) 
{
  /*var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min;
  return time;*/

  var utcSeconds = UNIX_timestamp / 1000.0;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);

  return d;
});
