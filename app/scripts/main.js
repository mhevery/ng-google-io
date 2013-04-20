'use strict';

function noop(){}

var $container = $('.hero-unit');

var $projectsTABLE = $container.find('table').remove();
var $projectsTBODY = $projectsTABLE.find('tbody');
var $projectTemplateTR = $projectsTBODY.find('>tr').remove();
var $projectAdd = $container.find('thead>tr>td>a');

var $detail = $container.find('form').remove();
var $projectName = $detail.find(':input[name=name]');
var $projectSite = $detail.find(':input[name=site]');
var $projectDescription = $detail.find(':input[name=description]');
var $detailCancel = $detail.find('a.btn');
var $detailSave = $detail.find('.btn.btn-primary');
var $detailDelete = $detail.find('.btn.btn-danger');
var removeCurrentView = noop;


function ProjectListController() {
  this.addProject = function (project) {
    var row = $projectTemplateTR.clone();
    row.find('>td:nth-child(1)>a').
        text(project.name).
        attr('href', project.url);
    row.find('>td:nth-child(2)').text(project.description);
    row.find('>td:nth-child(3)>a').
        attr('href', project.id).
        find('i').
        click(function(e) {
          e.preventDefault();
          detailController.show($(this).parent().attr('href'));
        });
    $projectsTBODY.append(row);
  };

  this.show = function () {
    var self = this;
    removeCurrentView();
    $container.append($projectsTABLE);
    $projectsTBODY.find('>tr').remove();
    firebase.on('child_added', onChildAdded);
    removeCurrentView = function() {
      firebase.off('child_added', onChildAdded);
      $projectsTABLE.remove();
    };
    function onChildAdded(snapshot) {
      var project = snapshot.val();
      project.id = snapshot.name();
      self.addProject(project);
    }
  };
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
    removeCurrentView();
    $detailCancel.click(function() {
      listController.show();
    });
    $detailSave.click(function(e) {
      e.preventDefault();
      self.saveDetail();
    });
    var projectFB = firebase.child(id);
    projectFB.on('value', onValue);
    removeCurrentView = function() {
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

  listController = new ProjectListController();
  detailController = new ProjectDetailController();

  listController.show();
}


main();
