'use strict';

var projectsApp = angular.module('projects', ['ngResource', 'ngRoute', 'ngAnimate']);

projectsApp.config(function($routeProvider) {
  $routeProvider.
      when('/', {
        controller: 'ProjectListCtrl as list',
        templateUrl: 'ProjectList.html',
        depth: 0
      }).
      when('/project/:id', {
        controller: 'ProjectDetailCtrl as detail',
        templateUrl: 'ProjectDetail.html',
        depth: 1
      });
});

projectsApp.run(function ($rootScope) {
  $rootScope.viewSlideAnimation = 'slide-left'; //always start the page from the left

  $rootScope.$on('$routeChangeStart', function(e, current, previous) {
    $rootScope.viewSlideAnimation = solveDirection(current, previous) || $rootScope.viewSlideAnimation;
  });

  $rootScope.$on('$routeChangeSuccess', function(e, current, previous) {
    $rootScope.viewSlideAnimation = solveDirection(current, previous, true) || $rootScope.viewSlideAnimation;
  });

  function solveDirection(current, previous, reverse) {
    if(previous && current) {
      return reverse ?
        (current.depth < previous.depth ? 'slide-left' : 'slide-right') :
        (current.depth < previous.depth ? 'slide-right' : 'slide-left');
    }
  };
});

projectsApp.factory('Project', function($resource) {
  return $resource('/project/:id', { id: '@id' });
});

projectsApp.controller('ProjectListCtrl', function(Project) {
  this.projects = Project.query();
});

projectsApp.controller('ProjectDetailCtrl', function(Project, $routeParams, $location) {
  this.project = $routeParams.id ?
      Project.get({id: $routeParams.id}) :
      new Project();

  this.save = function() {
    this.project.$save(goHome);
  };

  this.delete = function() {
    this.project.$delete(goHome);
  };

  function goHome() {
    $location.path('/');
  }
});

