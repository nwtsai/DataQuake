$(document).ready(function() 
{  
    $('#searchbar').hide();

    //hide refresh link in home page
    if($(".Title").text() == "DataQuake")
        $("#Refresh").hide();

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

    // When the refresh button is pressed
    $('#Refresh').click(function()
    {
        var timeInterval = $('.Title').attr('id');
        console.log(timeInterval);
        transitionToData(timeInterval);
    });

    // When the search button is pressed, search for the earthquake text and reload data
    $('#search').click(function(e)
    {
         e.preventDefault();
         var searchTerm = $('#search-textfield').val();
         searchEarthquakeData(searchTerm);
         $('#Refresh').hide();
    });
});

function transitionToData(timeInterval)
{
    $('#searchbar').show();
    $(".entire-koala").hide();
    $("body").css("background-color","#e3cda4");
    $("#Refresh").show();
    var descrip1 = "Earthquake locations and magnitudes within the past ";
    var descrip2 = "Each circle on the map indicates one earthquake; the larger the magnitude of the quake, the larger the radius.";

    if (timeInterval === "Day")
    {
        $(".Title").text("Past Day");
        $(".Title").attr('id', 'Day');
        $("#Description1").text(descrip1 + "24 hours.");
        $("#Description2").text(descrip2);
        getEarthquakeData("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson");
        $("#past_week").removeClass("active");
        $("#past_month").removeClass("active");
        $("#past_day").addClass("active");
    }
    else if (timeInterval === "Week")
    {
        $(".Title").text("Past Week");
        $(".Title").attr('id', 'Week');
        $("#Description1").text(descrip1 + "week.");
        $("#Description2").text(descrip2);
        getEarthquakeData("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
        $("#past_day").removeClass("active");
        $("#past_month").removeClass("active");
        $("#past_week").addClass("active");
    }
    else if (timeInterval === "Month")
    {
        $(".Title").text("Past Month");
        $(".Title").attr('id', 'Month');
        $("#Description1").text(descrip1 + "month.");
        $("#Description2").text(descrip2);
        getEarthquakeData("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson");
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

// Given a search term, look for the keyword or phrase
function searchEarthquakeData(searchTerm)
{
    var url;

    if($(".Title").attr('id') == "Day")
    {
        url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";
    }
    else if($(".Title").attr('id') == "Week")
    {
        url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
    }
    else if($(".Title").attr('id') == "Month")
    {
        url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
    }

    $.get(url)
    .done(function(res)
    {
        // Output earthquake data to the console
        console.log(res);

        var newRes = res;

        newRes.features = res.features.filter(function(obj)
        {
            // If the input is not a number, search through the locations array
            if (isNaN(searchTerm) == true)
            {
              var toSearch = obj.properties.title.toLowerCase();
              if (toSearch.search(searchTerm.toLowerCase()) != -1)
                  return true;
              else
                  return false;
            }

            // If the input is a number, search through the magnitude array and find magnitudes between between 4 and 5
            else
            {
              var toSearch = obj.properties.mag;
              var searchNum = Number(searchTerm);
              if (toSearch >= searchNum && toSearch <= 0.9 + searchNum)
                return true;
              else
                return false;
            }
            
        });

        setTimeout(function(){eqfeed_callback(newRes);
        }, 500);

        // When search button is pressed, change the title
        $(".Title").text("Search results for \"" + searchTerm + "\"");

        // If there is at least 1 search result
        if (newRes.features.length > 0)
        {
          // If the input is not a number, description tailors to location
          if (isNaN(searchTerm) == true)
            $("#Description1").text("Showing only the earthquakes with locations that include \"" + searchTerm + "\"");

          // If the input is a number, description tailors to magnitude
          else
            $("#Description1").text("Showing only the earthquakes with magnitudes between " + searchTerm + " and " + (Number(searchTerm) + 0.9));
        }
        else
        {
          // If the input is not a number, description reads no results
          if (isNaN(searchTerm) == true)
            $("#Description1").text("No results for \"" + searchTerm + "\"");

          // If the input is a number, description tailors to magnitude
          else
            $("#Description1").text("No results for earthquakes with magnitudes between " + searchTerm + " and " + (Number(searchTerm) + 0.9));
        }

        // For all cases, clear description 2
        $("#Description2").text("");

        // Handlebars getting template and getting data
        var source   = $("#earthquake-data").html();
        var template = Handlebars.compile(source);
        var html    = template(newRes.features);

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
  var utcSeconds = UNIX_timestamp / 1000.0;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);
  return d;
});
