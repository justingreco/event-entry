'use strict';

/**
 * @ngdoc function
 * @name eventEntryApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eventEntryApp
 */
angular.module('eventEntryApp')
  .controller('MainCtrl', function ($scope,$http, intersectionFactory, leafletData) {
   // $scope.streets = [];
    $scope.intersections = [];
    $scope.center = {
    	lat: 35.83,
    	lng: -78.85,
    	zoom: 14
    };

    var geometry = [];

    $scope.getStreets = function (value) {
	     intersectionFactory.getStreets(value).then(function (features) {
	    	$scope.streets = features;
	    });   	
    }

    $scope.streets = function(value) {
	    return $http.get("http://mapstest.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0/query?where=CARTONAME LIKE '"+value.toUpperCase()+"%'&returnGeometry=true&outSR=4326&f=json").then(function(response){
	      return response.data.features;
	    });
	  };


    $scope.streetSelected = function () {
    	intersectionFactory.getIntersections($scope.street.geometry, $scope.street.attributes.CARTONAME).then(function (features) {
    		$scope.intersections = features;
    	});
    };

    $scope.firstSelected = function () {
    	intersectionFactory.getIntersectionPoint($scope.street.attributes.CARTONAME, $scope.street1.attributes.CARTONAME).then(function (candidates) {
    		if (candidates.length > 0) {
    			$scope.location1 = candidates[0].location;
    		}
    	});
    }

    $scope.secondSelected = function () {
    	intersectionFactory.getIntersectionPoint($scope.street.attributes.CARTONAME, $scope.street2.attributes.CARTONAME).then(function (candidates) {
    		if (candidates.length > 0) {
    			$scope.location2 = candidates[0].location;
    			$scope.line = intersectionFactory.splitLine($scope.street.geometry, $scope.location1, $scope.location2);
    			geometry.push($scope.line);
    			$scope.geojson = {
    				data: geometry
    			}

				leafletData.getMap().then(function(map) {
					leafletData.getGeoJSON().then(function(geoJSON) {
						map.fitBounds(geoJSON.getBounds());
					});
                    //
                });    			
    		}
    	});
    }

  });
