var express = require('express');
var app = express();

var projects = [
  { id:1, name: 'AngularJS',   url: 'http://angularjs.org',   description: 'Super-heroic web-framework.'},
  { id:2, name: 'BackboneJS',  url: 'http://backbonejs.org',  description: 'Models for your apps.'},
  { id:3, name: 'BatmanJS',    url: 'http://batmanjs.org/',   description: 'Quick and beautiful.'},
  { id:4, name: 'Capucino',    url: 'http://cappuccino.org/', description: 'Objective-J.'},
  { id:5, name: 'EmberJS',     url: 'http://emberjs.com/',    description: 'Ambitious web apps.'},
  { id:6, name: 'GWT',         url: 'https://developers.google.com/web-toolkit/', description: 'JS in Java.'},
  { id:7, name: 'jQuery',      url: 'http://jquery.com/',     description: 'Write less, do more.'},
  { id:8, name: 'Knockout',    url: 'http://knockoutjs.com/', description: 'MVVM pattern.'},
  { id:9, name: 'Sammy',       url: 'http://sammyjs.org/',    description: 'Small with class.'},
  { id:10, name: 'Spine',      url: 'http://spinejs.com/',    description: 'Awesome MVC apps.'},
  { id:11, name: 'SproutCore', url: 'http://sproutcore.com/', description: 'Innovative web-apps.'}
];
var nextId = 1000;

app.use(express.static('app'))
app.use(express.bodyParser());

app.get('/project', function(req, res) {
  res.send(projects);
});

function getById(id) {
  return projects.reduce(function(found, current) {
    return found || current.id == id && current;
  }, false);
}

function save(project, body) {
  project.name = body.name;
  project.url = body.url;
  project.description = body.description;
  return project;
}

app.get('/project/:id', function(req, res) {
  res.send(getById(req.params.id));
});

app.post(/^\/project\/?$/, function(req, res) {
  var project = { id: nextId++ };

  projects.push(project);

  res.send(save(project, req.body));
});

app.post('/project/:id', function(req, res) {
  res.send(save(getById(req.params.id), req.body));
});

app.delete('/project/:id', function(req, res) {
  projects = projects.filter(function(project) {
    return project.id != req.params.id;
  });
  res.send('OK');
});


app.listen(8888);
console.log('Listening on port 8888');
