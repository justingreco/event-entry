'use strict';

/**
 * @ngdoc function
 * @name eventEntryApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the eventEntryApp
 */
angular.module('eventEntryApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
