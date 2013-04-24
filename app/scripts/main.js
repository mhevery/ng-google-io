'use strict';

var $container = $('.hero-unit');

var $projectsTABLE = $container.find('.list').remove();
var $projectsTBODY = $projectsTABLE.find('tbody');
var $projectTemplateTR = $projectsTBODY.find('>tr').remove();
var $projectAdd = $projectsTABLE.find('thead>tr>th>a');

var $detail = $container.find('form').remove();
var $projectName = $detail.find(':input[name=name]');
var $projectSite = $detail.find(':input[name=site]');
var $projectDescription = $detail.find(':input[name=description]');
var $detailCancel = $detail.find('a.btn');
var $detailSave = $detail.find('.btn.btn-primary');
var $detailDelete = $detail.find('.btn.btn-danger');

function ProjectListController() {
  var self = this;

  this.show = function () {
    $container.children().remove();
    $container.append($projectsTABLE);
    $projectsTBODY.find('>tr').remove();
    $projectAdd.click(function(e) {
      e.preventDefault();
      detailController.show();
    });

    $.ajax('/project').
        done(function(projects) {
          for(var i = 0, ii = projects.length; i < ii; i++) {
            self.addProject(projects[i]);
          }
        });
  };

  this.addProject = function (project) {
    var row = $projectTemplateTR.clone();
    row.find('>td:nth-child(1)>a').
        text(project.name).
        attr('href', project.url);
    row.find('>td:nth-child(2)').text(project.description);
    row.find('>td:nth-child(3)>a>i').
        click(function(e) {
          e.preventDefault();
          detailController.show(project.id);
        });
    $projectsTBODY.append(row);
  };
}


function ProjectDetailController() {
  var self = this;

  this.show = function(id) {
    $container.children().remove();
    $detailCancel.click(listController.show);
    $detailSave.click(function(e) {
      e.preventDefault();
      self.saveDetail(id);
    });
    $detailDelete.click(function(e) {
      e.preventDefault();
      self.deleteDetail(id);
    });

    if (id) {
      $.ajax('/project/' + id).
          done(function(project) {
            $projectName.val(project.name);
            $projectSite.val(project.url);
            $projectDescription.val(project.description);
            $container.append($detail);
          });
    } else {
      $projectName.val('');
      $projectSite.val('');
      $projectDescription.val('');
      $container.append($detail);
    }
  };

  this.saveDetail = function(id) {
    $.ajax({
      url: '/project/' + (id || ''),
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        name: $projectName.val(),
        description: $projectDescription.val(),
        url: $projectSite.val()
      })
    }).done(listController.show);
  };

  this.deleteDetail = function(id) {
    if (id) {
      $.ajax({
        url: '/project/' + id,
        type: 'DELETE'
      }).done(listController.show);
    }
  };
}


var listController = new ProjectListController();
var detailController = new ProjectDetailController();

listController.show();
