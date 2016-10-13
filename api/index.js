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
	    console.log('Error connecting to Db');
	    return;
	  }
	  console.log('Connection established');
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

	con.query('select * from component;' + 
		'select * from version order by id desc limit 5;' + 
		'select * from pipeline;' +
		'select distinct pipeline.step_name, count(pipeline.step_name) as amount from version, pipeline where version.pipeline_id = pipeline.id group by pipeline_id;' +
		'select distinct status.status_name, count(status.status_name) as amount from version, status where version.status_id = status.id group by status.id;', function(err, rows) {
		var components = [];

		for (var i = 0; i < rows[0].length; i++) {
			var component = {
				id: rows[0][i].id,
				name: rows[0][i].component_name
			}
			//console.log(rows[0].component_name);
			components.push(component);
		}

		var versions = [];

		for (var i = 0; i < rows[1].length; i++) {
			var version = {
				id: rows[1][i].id, 
				versionName: rows[1][i].version_num,
				name: rows[1][i].component_id,
				step: rows[1][i].pipeline_id,
				status: rows[1][i].status_id
			}

			versions.push(version);
		}

		for (var i = 0; i < versions.length; i++) {
			for (var j = 0; j  < components.length; j++) {
				if (versions[i].name === components[j].id) {
					versions[i].name = components[j].name;
				}
			}
		}

		var steps = [];

		for (var i = 0; i < rows[2].length; i++) {
			var step = {
				id: rows[2][i].id,
				name: rows[2][i].step_name
			}
			
			steps.push(step);
		}

		for (var i = 0; i < versions.length; i++) {
			for (var j = 0; j  < steps.length; j++) {
				if (versions[i].step === steps[j].id) {
					versions[i].step = steps[j].name;
				}
			}
		}

		var stepStats = [];
		for (var i = 0; i < rows[3].length; i++) {
			var stat = {
				name: rows[3][i].step_name,
				amount: rows[3][i].amount
			}
			
			stepStats.push(stat);
		}

		var statusStats = [];
		for (var i = 0; i < rows[4].length; i++) {
			var stat = {
				name: rows[4][i].status_name,
				amount: rows[4][i].amount
			}

			statusStats.push(stat);
		}


		var data = [versions, stepStats, statusStats];

		res.send(data);
	});
});


api.get('/versions', function(req, res) {
	

	con.query('select * from component; select * from version; select * from pipeline', function(err, rows) {
		var components = [];

		for (var i = 0; i < rows[0].length; i++) {
			var component = {
				id: rows[0][i].id,
				name: rows[0][i].component_name
			}
			//console.log(rows[0].component_name);
			components.push(component);
		}

		var versions = [];

		for (var i = 0; i < rows[1].length; i++) {
			var version = {
				id: rows[1][i].id, 
				versionName: rows[1][i].version_num,
				name: rows[1][i].component_id,
				step: rows[1][i].pipeline_id,
				status: rows[1][i].status_id
			}

			versions.push(version);
		}

		for (var i = 0; i < versions.length; i++) {
			for (var j = 0; j  < components.length; j++) {
				if (versions[i].name === components[j].id) {
					versions[i].name = components[j].name;
				}
			}
		}

		var steps = [];

		for (var i = 0; i < rows[2].length; i++) {
			var step = {
				id: rows[2][i].id,
				name: rows[2][i].step_name
			}
			
			steps.push(step);
		}

		for (var i = 0; i < versions.length; i++) {
			for (var j = 0; j  < steps.length; j++) {
				if (versions[i].step === steps[j].id) {
					versions[i].step = steps[j].name;
				}
			}
		}

		res.send(versions);
	});

	
});


module.exports  = api;