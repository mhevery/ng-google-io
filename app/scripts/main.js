'use strict';

var projectApp = angular.module('projectApp', ['firebase']);

projectApp.config(function($routeProvider){
  $routeProvider.
      when('/', {templateUrl: 'list.html', controller: ProjectListController}).
      when('/project/:id', {templateUrl: 'project.html', controller: ProjectDetailController}).
      otherwise('/');
});

projectApp.factory('projects', function() {});
projectApp.value('fbUrl', 'https://ng-projects.firebaseio.com/');


function ProjectListController($scope, angularFire, fbUrl) {
  angularFire(fbUrl, $scope, 'projects', {});
}


function ProjectDetailController($scope, $routeParams, angularFire, fbUrl) {
  angularFire(fbUrl + $routeParams.id, $scope, 'project', {});
}
