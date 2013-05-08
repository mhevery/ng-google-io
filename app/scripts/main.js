'use strict';

var projectsApp = angular.module('projects', ['ngResource']);

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
  $rootScope.$on('$routeChangeSuccess', function(e, current, previous) {
    var direction = current && previous && current.depth < previous.depth;

    $rootScope.viewSlideAnimation = {
      enter: direction ? 'slide-left-enter' : 'slide-right-enter',
      leave: direction ? 'slide-right-leave' : 'slide-left-leave'
    }
  });
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

