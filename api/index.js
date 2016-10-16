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

con.connect(function(err){
	  if(err){
	    //console.log('Error connecting to Db');
	    return;
	  }
	  //console.log('Connection established');
});



api.get('/components', function(req, res) {
	
	con.query('select * from component', function(err, rows) {
		var components = [];

		for (var i = 0; i < rows.length; i++) {
			var component = {
				id: rows[i].id,
				name: rows[i].component_name
			}
			//console.log(rows[0].component_name);
			components.push(component);
		}
		res.send(JSON.stringify(components));
	});	
	
});

api.get('/steps', function(req, res) {
	con.query('select * from pipeline', function(err, rows) {
		var steps = [];

		for (var i = 0; i < rows.length; i++) {
			var step = {
				id: rows[i].id,
				name: rows[i].step_name
			}
			
			steps.push(step);
		}

		

		res.send(JSON.stringify(steps));
	});
	
});

api.get('/update', function(req, res) {
	var versions = [];

	con.query('select version.id, version.version_num, component.component_name, pipeline.step_name, status.status_name from version, component, pipeline, status where version.component_id = component.id and version.pipeline_id = pipeline_id and version.status_id = status.id order by version.id desc limit 5;' + 
		'select distinct pipeline.step_name, count(pipeline.step_name) as amount from version, pipeline where version.pipeline_id = pipeline.id group by pipeline_id;' +
		'select distinct status.status_name, count(status.status_name) as amount from version, status where version.status_id = status.id group by status.id;', function(err, rows) {
		

		var versions = [];

		for (var i = 0; i < rows[0].length; i++) {
			var version = {
				id: rows[0][i].id, 
				versionName: rows[0][i].version_num,
				name: rows[0][i].component_name,
				step: rows[0][i].step_name,
				status: rows[0][i].status_name
			}

			versions.push(version);
		}

				
		var stepStats = [];
		for (var i = 0; i < rows[1].length; i++) {
			var stat = {
				name: rows[1][i].step_name,
				amount: rows[1][i].amount
			}
			
			stepStats.push(stat);
		}

		var statusStats = [];
		for (var i = 0; i < rows[2].length; i++) {
			var stat = {
				name: rows[2][i].status_name,
				amount: rows[2][i].amount
			}

			statusStats.push(stat);
		}


		var data = [versions, stepStats, statusStats];

		res.send(data);
	});
});


api.get('/versions', function(req, res) {
	

	con.query('select version.id, version.version_num, component.component_name, pipeline.step_name, status.status_name from version, component, pipeline, status where version.component_id = component.id and version.pipeline_id = pipeline_id and version.status_id = status.id;', function(err, rows) {
		

		var versions = [];

		for (var i = 0; i < rows.length; i++) {
			var version = {
				id: rows[i].id, 
				versionName: rows[i].version_num,
				name: rows[i].component_name,
				step: rows[i].step_name,
				status: rows[i].status_name
			}

			versions.push(version);
		}

		res.send(versions);
	});

	
});


module.exports  = api;