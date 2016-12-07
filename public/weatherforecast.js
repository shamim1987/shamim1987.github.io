var openWeatherAppId = '9fa53fa43aee027ccddf17a69acbea83',
  openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast'

alert(openWeatherUrl)

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
var savingCity = database.ref().child('Cities')

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
    alert(openWeatherUrl)
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
      var savedCity = savingCity.child(cityName)

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
        var savedDate = savedCity.child(date).set({
          temperature: temperature,
          humidity: humidity
        })
      })
      var cityTable = document.getElementById('cityList')

// get city from DB
      savedCity.on('value', function (dateSnapshot) {
        for (var dateSnap in dateSnapshot.val()) {
          var tR = document.createElement('tr')
          var tD1 = document.createElement('td')
          tD1.innerText = dateSnap
          tR.appendChild(tD1)
          cityTable.appendChild(tR)
          for (var tempSnapshot in dateSnapshot.val()[dateSnap]) {
            var tD2 = document.createElement('td')
            tD2.innerText = dateSnapshot.val()[dateSnap][tempSnapshot]
            tR.appendChild(tD2)
            cityTable.appendChild(tR)
          }
        }
      })

//Render Cities
var h4 = document.getElementById('h4')
var test = document.getElementById('test')
h4.innerText = cityName
savingCity.on('child_added',function(snapshot) {
  var table = document.createElement('table')
  table.innerHTML = snapshot.val()
  test.appendChild(table)
})
//Remove Cities

    }
  })
  $('#log').html(selectedCity)
  $('#log').append($savebutn)
}
