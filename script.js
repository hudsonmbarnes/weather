// API key
var apiKey = "87ceb664de1d2bf8badf55a9e9904a30";


var searchButton = $(".searchButton");

// Forloop for the data 
for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".list").addClass("list-item");
    cityName.append("<li>" + city + "</li>");
}
// Search button
var userInput = 0;
searchButton.click(function() {

var searchInput = $(".searchInput").val();

// Variables for current and five day weather
var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

// Input response for search
if (searchInput == "") {
    console.log(searchInput);
} else {
    $.ajax({
        url: urlCurrent,
        method: "GET"
    }).then(function (response) {
        var cityName = $(".list").addClass("list-item");
        cityName.append("<li>" + response.name + "</li>");
// Local storage
        var local = localStorage.setItem(userInput, response.name);
        userInput = userInput + 1;

// Current weather append
        var currentCard = $(".currentCard").append("<div>").addClass("card-body");
        currentCard.empty();
        var currentName = currentCard.append("<p>");
        currentCard.append(currentName);
// Date, temperature, humidity, 
        var timeUTC = new Date(response.dt * 1000);
        currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
        currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
        var currentTemp = currentName.append("<p>");       
        currentName.append(currentTemp);
        currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
        currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
        currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

// UV Index URL
         var urlUv = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;
 
// UV Index
         $.ajax({
            url: urlUv,
            method: "GET"
        }).then(function(response) {

            var currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
            currentUV.addClass("UV");
            currentTemp.append(currentUV);

            var uvIndex = response.value;
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
        `);

// UV resposive color
        $("#uvIndex").append(uvIndexP);

            futureCondition(lat, lon);
            
        if (uvIndex >= 0 && uvIndex <= 2) {
            $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
        } else if (uvIndex >= 3 && uvIndex <= 5) {
            $("#uvIndexColor").css("background-color", "#FFF300");
        } else if (uvIndex >= 6 && uvIndex <= 7) {
            $("#uvIndexColor").css("background-color", "#F18B00");
        } else if (uvIndex >= 8 && uvIndex <= 10) {
            $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
        } else {
            $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white");
        }    
    });
    
});
    

// 5day forcast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {

// Array
            var day = [0, 8, 16, 24, 32];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");
                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            })

        });
    }
});
