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

  var savedCity = database.ref(cityName)
  var $savebutn = $('<button/>', {
    id: 'save',
    text: 'Save City'
  })
  $('#log').html(selectedCity)
  $('#log').append($savebutn)

    // prepare saved cities
  $('#save').click(function () {
    forecast.list.forEach(function (forecastEntry) {
      var date = forecastEntry.dt_txt
      var temperature = forecastEntry.main.temp
      var humidity = forecastEntry.main.humidity
      var savedDate = savedCity.child(date).set({temperature: temperature, humidity: humidity})
    })
    var cityTable = document.getElementById('cityList')
    var titleBox = document.getElementById('city_name')
    var cityBox = document.getElementById('cityBox')
    savedCity.once('child_added', function (snapshot) {
      var cityList = document.createElement('li')
      var anchor = document.createElement('button')
      anchor.title = cityName
      anchor.setAttribute('id', cityName)
      anchor.setAttribute('class', 'btn btn-primary btn-city')
      anchor.setAttribute('data-toggle', 'modal')
      anchor.setAttribute('data-target', '.bs-example-modal-lg')
      var linkText = document.createTextNode(cityName)
      anchor.appendChild(linkText)
      cityList.appendChild(anchor)
      titleBox.appendChild(cityList)
    })
  })
    // activate city modal
  var chosenCity = document.getElementById('chosenCity')
  var cityModal = document.getElementById('citymodalDiv')
  var weatherParams = document.getElementById('weatherParams')
  var tBod = document.getElementById('tBod')

  $('#cityBox').on('click', '#'+cityName, function () {
    savedCity.once('value', function (dateSnapshot) {
      for (var snap in dateSnapshot.val()) {
        var tD1 = document.createElement('td')
        tD1.setAttribute('id',cityName)
        var tR = document.createElement('tr')
        tR.setAttribute('id',cityName)
        tD1.innerText = snap
        tR.appendChild(tD1)
        tBod.appendChild(tR)
        for (var tempSnapshot in dateSnapshot.val()[snap]) {
          console.log(tempSnapshot)
          var tD2 = document.createElement('td')
          tD2.setAttribute('id',cityName)
          tD2.innerText = dateSnapshot.val()[snap][tempSnapshot]
          tR.appendChild(tD2)
          tBod.appendChild(tR)
        }
      }

    })
  })

    // Delete City from database

  $('#mod-foot').on('click', '#del-city', function () {
    alert('this works doesnt it?')
    database.ref().child(cityName).remove()
  })
}
