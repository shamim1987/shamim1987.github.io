var openWeatherAppId = '9fa53fa43aee027ccddf17a69acbea83',
  openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDetsWY2WEsxPVrWMrWfwi_76ddUVup1SU',
  authDomain: 'travel-weather-1480309624931.firebaseapp.com',
  databaseURL: 'https://travel-weather-1480309624931.firebaseio.com',
  storageBucket: 'travel-weather-1480309624931.appspot.com',
  messagingSenderId: '1049911185636'
}
firebase.initializeApp(config)
var database = firebase.database()
// var savingCity = database.ref('cities')

var prepareData = function (units) {
    // Replace loading image
  var cityName = $('#city-name').val()
    // Make ajax call, callback
  if (cityName && cityName != '') {
    cityName = cityName.trim()
    getData(openWeatherUrl, cityName, openWeatherAppId, units)
  } else {
    alert('Please enter the city name')
  }
}
$(document).ready(function () {
  $('.btn-metric').click(function () {
    prepareData('metric')
  })
  $('.btn-imperial').click(function () {
    prepareData('imperial')
  })
})
function getData (url, cityName, appId, units) {
  var request = $.ajax({
    url: url,
    dataType: 'jsonp',
    data: {
      q: cityName,
      appid: appId,
      units: units
    },
    jsonpCallback: 'fetchData',
    type: 'GET'
  }).fail(function (error) {
    console.error(error)
    alert('Error sending request')
  })
}
function fetchData (forecast) {
    // console.log(forecast)
  var selectedCity = '',
    cityName = forecast.city.name,
    country = forecast.city.country

  selectedCity += '<h3> Weather Forecast for ' + cityName + ', ' + country + '</h3>'
  forecast.list.forEach(function (forecastEntry) {
        // console.log(forecastEntry)
    var date = forecastEntry.dt_txt
    var temperature = forecastEntry.main.temp
    selectedCity += '<tr>' + '<td>' + date + '</td>' + '<td>' + temperature + '</td>' + '</tr>'
  })
  var $savebutn = $('<button/>', {
    id: 'save',
    text: 'Save City',
    click: function () {
            // add city to DB
      var savedCity = database.ref(cityName)

            // check if city has alr been saved
            // savedCity.on('value', function (snapshot) {
            //   // console.log(searchCity.val())
            //   console.log('data from database searching for ' + cityName)
            //   console.log(snapshot.val())
            //   if (cityName == '') {
            //     alert('You saved this city already bruh')
            //   } else {
            //     alert('City Added!')
            //   }
            // })

      forecast.list.forEach(function (forecastEntry) {
        var date = forecastEntry.dt_txt
        var temperature = forecastEntry.main.temp
        var humidity = forecastEntry.main.humidity
        var savedDate = savedCity.child(date).set({temperature: temperature, humidity: humidity})
      })
      var cityTable = document.getElementById('cityList')
      var titleBox = document.getElementById('city_name')
      var cityBox = document.getElementById('cityBox')

            // get city from DB &&

      savedCity.once('child_added', function (snapshot) {
        var cityList = document.createElement('li')
        var anchor = document.createElement('a')
        anchor.title = cityName;
        anchor.href = "http://example.com";
        var linkText = document.createTextNode(cityName);
        anchor.appendChild(linkText);
        cityList.appendChild(anchor)
        titleBox.appendChild(cityList)
      })

      // savedCity.on('child_added', function (dateSnapshot) {
      //   console.log(dateSnapshot.val())
      //   for (var snap in dateSnapshot.val()) {
      //     // console.log(dateSnapshot.val()[dateSnap])
      //     var tR = document.createElement('tr')
      //     var tD1 = document.createElement('td')
      //     var tD2 = document.createElement('td')
      //     tD1.innerText = dateSnapshot.val()[snap]
      //     tD2.innerText = snap
      //     tR.appendChild(tD1)
      //     tR.appendChild(tD2)
      //     cityTable.appendChild(tR)
      //
      //               // for (var tempSnapshot in dateSnapshot.val()[dateSnap]) {
      //               //   console.log(tempSnapshot)
      //               //   var tD2 = document.createElement('td')
      //               //   tD2.innerText = dateSnapshot.val()[dateSnap][tempSnapshot]
      //               //   tR.appendChild(tD2)
      //               //   cityTable.appendChild(tR)
      //               // }
      //   }
      //   cityContainer.appendChild(cityTable)
        // cityBox.appendChild(cityContainer)
      // })
    }
  })
  $('#log').html(selectedCity)
  $('#log').append($savebutn)
}
