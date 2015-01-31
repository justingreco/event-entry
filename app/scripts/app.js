'use strict';

/**
 * @ngdoc overview
 * @name eventEntryApp
 * @description
 * # eventEntryApp
 *
 * Main module of the application.
 */
angular
  .module('eventEntryApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive', 
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider){
     $httpProvider.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;charset=utf-8";
      // $httpProvider.defaults.transformRequest = function(data){
      //     if (data === undefined) {
      //         return data;
      //     }
      //     var shallowEncoded = $.param( data, true );
      //     var shallowDecoded = decodeURIComponent( shallowEncoded );          
      //     return shallowEncoded;
      // }         
  })
  .factory('intersectionFactory', function ($http, $q) {
    var baseUrl = 'http://mapstest.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0';
    var geocodeUrl = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/Locator/GeocodeServer/findAddressCandidates';
    var service = {};

    service.getStreets = function (value) {
      var deferred = $q.defer();
      $http({
        url: baseUrl + '/query',
        params: {f: 'json', where: "CARTONAME LIKE '" + value + "%'", returnGeometry: true, outSr: 4326},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function (data) {
        deferred.resolve(data.features);
      });
      return deferred.promise;
    }

    service.getIntersections = function (geometry, name) {
      var deferred = $q.defer();
      $http({
        url: baseUrl + '/query',
        method: 'POST',  
        data: $.param({f: 'json', where: "CARTONAME <> '" + name + "'", geometry: JSON.stringify(geometry), returnGeometry: true, outSr: 4326, inSr: 4326, geometryType: 'esriGeometryPolyline'})
      })
      .success(function (data) {
        deferred.resolve(data.features);
      });
      return deferred.promise;
    }

    service.getIntersectionPoint = function (street1, street2) {
      var deferred = $q.defer();
      $http({
        url: geocodeUrl,
        method: 'GET',        
        params: {f: 'json', 'Single Line Input': street1 + ' & ' + street2, outSR: 4326}
      }).success(function (data) {
        deferred.resolve(data.candidates);
      });
      return deferred.promise;
    }

    service.splitLine = function (street, point1, point2) {
      var converter = esriConverter();
      street = converter.toGeoJson(street);
      var line = {type: 'Feature', properties: {}, geometry: street};
      point1 = turf.point([point1.x, point1.y]);
      point2 = turf.point([point2.x, point2.y]);
      var sliced = turf.lineSlice(point1, point2, line);
      return sliced;

    };
    return service;
  });
