'use strict';

function MainController($scope) {
  $scope.view = 'list';
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


function ProjectDetailController() {
  this.saveDetail = function() {
    var id = $detail.attr('url');
    var projectFB = firebase.child(id);
    var project = {
      name: $projectName.val(),
      description: $projectDescription.val(),
      url: $projectSite.val()
    };
    projectFB.set(project);
    listController.show();
  };

  this.show = function(id) {
    var self = this;
    releaseListeners();
    $detailCancel.click(function() {
      listController.show();
    });
    $detailSave.click(function(e) {
      e.preventDefault();
      self.saveDetail();
    });
    var projectFB = firebase.child(id);
    projectFB.on('value', onValue);
    releaseListeners = function() {
      firebase.off('value', onValue);
      $detail.remove();
    };
    function onValue(snapshot) {
      var project = snapshot.val();
      $detail.attr('url', id);
      $projectName.val(project.name);
      $projectSite.val(project.url);
      $projectDescription.val(project.description);
      $container.append($detail);
    }
  };
}


var listController;
var detailController;
var firebase

function main() {
  firebase = new Firebase('https://ng-projects.firebaseio.com/');
}


main();
