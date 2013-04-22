'use strict';

function MainController($scope) {
  $scope.view = 'list';

  $scope.showDetail = function(id) {
    $scope.view = 'detail';
    $scope.detailId = id;
    releaseListeners();
  }
  
  $scope.showList = function() {
    $scope.view = 'list';
    $scope.detailId = null;
    releaseListeners();
  }
}

function noop(){}

var releaseListeners = noop;


function ProjectListController($scope) {
  $scope.projects = [];

  firebase.on('child_added', onChildAdded);
  releaseListeners = function() {
    firebase.off('child_added', onChildAdded);
  };
  function onChildAdded(snapshot) {
    var project = snapshot.val();
    project.id = snapshot.name();
    $scope.projects.push(project);
    $scope.$apply();
  }
}


function ProjectDetailController($scope) {

  var projectFB = firebase.child($scope.detailId);
  projectFB.on('value', onValue);
  releaseListeners = function() {
    firebase.off('value', onValue);
  };
  function onValue(snapshot) {
    $scope.project = snapshot.val();
    $scope.project.id = snapshot.name();
    $scope.$apply();
  }

  this.saveDetail = function() {
    var projectFB = firebase.child($scope.detailId);
    projectFB.set($scope.project);
    $scope.showList();
  };
}


var firebase;

function main() {
  firebase = new Firebase('https://ng-projects.firebaseio.com/');
}


main();
