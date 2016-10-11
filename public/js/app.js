var app = angular.module('app', ['ui.bootstrap']);

app.filter('startFrom', function() {
	return function(data, start) {
		return data.slice(start);
	}
});

app.controller('mainCtrl', function ($scope, $http, $q) {
	$scope.versions = [];
	$scope.components = [];
	$scope.steps = [];
	$scope.stepStats = [];
	$scope.statusStats = [];


	$q.all([
		getLastUpdate(),
		getSteps()	
	]).then(function(data) {
		var version = data[0][0];
		var stats = data[0][1];
		var stats2 = data[0][2];
		var step = data[1];
		setVersions(version);
		setStepStats(stats);
		setStatusStats(stats2);
		setSteps(step);
	}).then(function() {
		setVersionSteps();
		setStatusName();
		google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawStepChart);
        google.charts.setOnLoadCallback(drawStatusChart);
		
	})

	
      function drawStepChart() {
        var data = new google.visualization.DataTable();
          data.addColumn('string', 'Pipeline Steps');
          data.addColumn('number', 'Amount of Components');
          data.addRows($scope.stepStats.length);
          
          for (var i = 0; i < $scope.stepStats.length; i++) {
          		data.setCell(i, 0, $scope.stepStats[i].name);
          		data.setCell(i, 1, $scope.stepStats[i].amount);
          }
        

        var options = {
          title: 'Amount of Components per Pipeline Step',
          pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
      }

      function drawStatusChart() {
        var data = google.visualization.arrayToDataTable([
          ['Step Results', 'Amount of Components'],
          [$scope.statusStats[0].name, $scope.statusStats[0].amount],
          [$scope.statusStats[1].name, $scope.statusStats[1].amount],
          [$scope.statusStats[2].name, $scope.statusStats[2].amount]
        ]);

        var options = {
          title: 'Amount of Components per Status',
          pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart2'));
        chart.draw(data, options);
      }

	function getLastUpdate() {
		var deffered = $q.defer();
		$http.get('/api/update')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 	
	}

	function getComponents() {
		var deffered = $q.defer();
		$http.get('/api/components')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 	
	}

	function getSteps() {
		var deffered = $q.defer();
		$http.get('/api/steps')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 
	}

	function setVersions(data) {
		$scope.versions = data;
		
	}

	function setComponents(data) {
		$scope.components = data;
		
	}

	function setSteps(data) {
		$scope.steps = data;
		
	}

	function setStepStats(data) {
		
		for (var i = 0; i < data.length; i++) {
			var stats = {
				name: data[i].name,
				amount: data[i].amount
			}
			
			$scope.stepStats.push(stats);
		}

		

		
		
	}

	function setStatusStats(data) {
		for (var i = 0; i < data.length; i++) {
			var stats = {
				name: data[i].name,
				amount: data[i].amount
			}
			
			$scope.statusStats.push(stats);
		}
	}

	function setVersionNames() {
		for (var i = 0; i < $scope.versions.length; i++) {
			for (var j = 0; j  < $scope.components.length; j++) {
				if ($scope.versions[i].name === $scope.components[j].id) {
					$scope.versions[i].name = $scope.components[j].name;
				}
			}
		}
		
	}

	function setVersionSteps() {
		for (var i = 0; i < $scope.versions.length; i++) {
			for (var j = 0; j  < $scope.steps.length; j++) {
				if ($scope.versions[i].step === $scope.steps[j].id) {
					$scope.versions[i].step = $scope.steps[j].name;
				}
			}
		}
	}

	function setStatusName() {
		for (var i = 0; i < $scope.versions.length; i++) {
			switch($scope.versions[i].status) {
				case 1: $scope.versions[i].statusName = "good"; break;
				case 2: $scope.versions[i].statusName = "fail"; break;
				case 3: $scope.versions[i].statusName = "doubtful"; break;
			}
		}
	}

	 



});

app.controller('comCtrl', function($scope, $http, $q) {
	$scope.versions = [];
	$scope.components = [];
	$scope.steps = [];
	$scope.pageSize = 15;
	$scope.currentPage = 1;


	$q.all([
		getVersions(),
		
	]).then(function(data) {
		var version = data[0];
		

		setVersions(version);
		
	}).then(function() {
		
		setStatusName();
	})

	function getVersions() {
		var deffered = $q.defer();
		$http.get('/api/versions')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 	
	}

	function getComponents() {
		var deffered = $q.defer();
		$http.get('/api/components')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 	
	}

	function getSteps() {
		var deffered = $q.defer();
		$http.get('/api/steps')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 
	}

	function setVersions(data) {
		$scope.versions = data;
	
	}

	function setComponents(data) {
		$scope.components = data;
		
	}

	function setSteps(data) {
		$scope.steps = data;
	
	}


	function setStatusName() {
		for (var i = 0; i < $scope.versions.length; i++) {
			switch($scope.versions[i].status) {
				case 1: $scope.versions[i].statusName = "good"; break;
				case 2: $scope.versions[i].statusName = "fail"; break;
				case 3: $scope.versions[i].statusName = "doubtful"; break;
			}
		}
	}
});

app.controller('pipCtrl', function($scope, $http, $q) {
	
	$scope.components = [];
	$scope.steps = [];
	$scope.pageSize = 5;
	$scope.currentPage = 1;


	$q.all([
		getComponents(),
		getSteps()
		
	]).then(function(data) {
		var component = data[0];
		var step = data[1];
		

		setComponents(component);
		setSteps(step);
		
	});
	

	function getComponents() {
		var deffered = $q.defer();
		$http.get('/api/components')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 	
	}

	function getSteps() {
		var deffered = $q.defer();
		$http.get('/api/steps')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise; 
	}


	function setComponents(data) {
		$scope.components = data;
		
	}

	function setSteps(data) {
		$scope.steps = data;
	
	}


	
});