var express = require('express');
var api = express.Router();

var mysql = require('mysql');
var config = require('../config.js');

var con = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database,
	multipleStatements: true,
	stringifyObjects: true
});

con.connect();

// get all info about components
api.get('/components', function(req, res) {
	con.query('select * from component', function(err, rows) {
		res.send(rows);
	});
});

// get all info about steps in pipeline
api.get('/steps', function(req, res) {
	con.query('select * from pipeline', function(err, rows) {
		res.send(rows);
	});
});

// get analytical information for graphs
api.get('/update', function(req, res) {
	con.query('select version.id, version.version_num, component.component_name, pipeline.step_name, status.status_name from version, component, pipeline, status where version.component_id = component.id and version.pipeline_id = pipeline_id and version.status_id = status.id order by version.id desc limit 5;' +
		'select distinct pipeline.step_name, count(pipeline.step_name) as amount from version, pipeline where version.pipeline_id = pipeline.id group by pipeline_id;' +
		'select distinct status.status_name, count(status.status_name) as amount from version, status where version.status_id = status.id group by status.id;', function(err, rows) {
		var data = [rows[0], rows[1], rows[2]];
		res.send(data);
	});
});

// get all information about the versions of compoents
api.get('/versions', function(req, res) {
	con.query('select version.id, version.version_num, component.component_name, pipeline.step_name, status.status_name from version, component, pipeline, status where version.component_id = component.id and version.pipeline_id = pipeline_id and version.status_id = status.id;', function(err, rows) {
		res.send(rows);
	});
});


module.exports  = api;
