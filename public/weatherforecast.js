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

//var cityName = $('#city-name').val()

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
  var selectedCity = '',
    cityName = forecast.city.name,
    country = forecast.city.country

  selectedCity += '<h3> Weather Forecast for ' + cityName + ', ' + country + '</h3>'
  forecast.list.forEach(function (forecastEntry) {
    var date = forecastEntry.dt_txt
    var temperature = forecastEntry.main.temp
    selectedCity += '<tr>' + '<td>' + date + '</td>' + '<td>' + temperature + '</td>' + '</tr>'
  })

  var savedCity = database.ref().child(cityName)
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
    var cityList = document.createElement('li')
    var anchor = document.createElement('button')
    var div = document.createElement('div')
    anchor.title = cityName
   savedCity.once('child_added', function (snapshot) {
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

  $('#cityBox').on('click','#' + cityName, function () {
    savedCity.on('value', function (dateSnapshot) {
      // var div1 = document.createElement('div')
      // div1.setAttribute('class','modal fade bs-example-modal-lg')
      // div1.setAttribute('tabindex','-1')
      // div1.setAttribute('role','dialog')
      // div1.setAttribute('aria-labelledby','myLargeModalLabel')
      // var div2 = document.createElement('div')
      // div2.setAttribute('class','modal-dialog modal-lg')
      // div2.setAttribute('role','document')
      // div1.appendChild(div2)
      // var div3 = document.createElement('div')
      // div3.setAttribute('class','modal-content')
      // div2.appendChild(div3)
      // var table = document.createElement('table')
      // table.setAttribute('class','table')
      // table.setAttribute('id','chosenCity')
      // var div1 = document.getElementsByClassName('bs-example-modal-lg')
      // div1.setAttribute('id',cityName)
      // var div2 = document.getElementsByClassName('modal-dialog')
      // div2.setAttribute('id',cityName)
      // var div3 = document.getElementsByClassName('modal-content')
      // div3.setAttribute('id',cityName)
      var tR1 = document.createElement('tr')
      var tD3= document.createElement('td')
      tD3.innerText = cityName
      tR1.appendChild(tD3)
      chosenCity.appendChild(tR1)
      for (var snap in dateSnapshot.val()) {
        var tR = document.createElement('tr')
        tR.setAttribute('id', cityName)
        var tD1 = document.createElement('td')
        tD1.setAttribute('id', cityName)
        tD1.innerText = snap
        tR.appendChild(tD1)
        chosenCity.appendChild(tR)
        for (var tempSnapshot in dateSnapshot.val()[snap]) {
          //console.log(tempSnapshot)
          var tD2 = document.createElement('td')
          tD2.setAttribute('id', cityName)
          tD2.innerText = dateSnapshot.val()[snap][tempSnapshot]
          tR.appendChild(tD2)
          chosenCity.appendChild(tR)
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
