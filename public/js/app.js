var app = angular.module('app', ['ui.bootstrap', 'ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider

		.when('/', {
			templateUrl: '/partials/index.html',
			controller: 'mainCtrl'

		})

		.when('/components', {
			templateUrl: '/partials/component.html',
			controller: 'comCtrl'
		})

		// .when('/pipeline', {
		// 	templateUrl: '/partials/pip.html',
		// 	controller: 'pipCtrl'
		// })

		.otherwise({
			redirectTo: '/'
		});

		// enable html5Mode for pushstate ('#'-less URLs)
	    $locationProvider.html5Mode(true);
	    $locationProvider.hashPrefix('!');
});

app.filter('startFrom', function() {
	return function(data, start) {
		
		return data.slice(start);
	}
});

app.controller('routeCtrl', function ($scope, $location) {
	$scope.isActive = function(route) {

        return route === $location.path();
    }
});

app.controller('mainCtrl', function ($scope, $http, $q) {
	$scope.versions = [];
	$scope.steps = [];
	$scope.stepStats = [];
	$scope.statusStats = [];
	$scope.showLoader = true;


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
		google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawStepChart);
        google.charts.setOnLoadCallback(drawStatusChart);
		$scope.showLoader = false;
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
          bar: {groupWidth: "50%"},
          legend: { position: "none" },
         
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('donutchart'));
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
          title: 'Percentage of Components per Status',
          
         
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


	function setSteps(data) {
		$scope.steps = data;
		
	}

	function setStepStats(data) {
		$scope.stepStats = data;	
		
	}

	function setStatusStats(data) {
		$scope.statusStats = data;
	}


});

app.controller('comCtrl', function($scope, $http, $q) {
	$scope.versions = [];
	$scope.components = [];
	$scope.pageSize = 15;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.tableData = [];
	$scope.selectComponent = 'All Components';
	$scope.showLoader = true;


	$q.all([
		getVersions(),
		getComponents()
		
	]).then(function(data) {
		var version = data[0];
		var component = data[1];

		setVersions(version);
		setComponents(component);
		
	}).then(function() {
		$scope.tableData = $scope.versions;
		$scope.showLoader = false;
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

	

	function setVersions(data) {
		$scope.versions = data;
	
	}

	function setComponents(data) {
		$scope.components = data;
		
	}



	$scope.getTableData = function(data) {
		
		if (data === 'All Components') {
			$scope.tableData = $scope.versions;
		} else {

			var results = [];
			for (var i = 0; i < $scope.versions.length; i++) {
				if ($scope.versions[i].name === data) {
					results.push($scope.versions[i]);
				}
			}
			
			$scope.tableData = results;
		}


	}
});

// app.controller('pipCtrl', function($scope, $http, $q, $location) {
	
// 	$scope.components = [];
// 	$scope.steps = [];
// 	$scope.pageSize = 5;
// 	$scope.currentPage = 1;


// 	$q.all([
// 		getComponents(),
// 		getSteps()
		
// 	]).then(function(data) {
// 		var component = data[0];
// 		var step = data[1];
		

// 		setComponents(component);
// 		setSteps(step);
		
// 	});
	

// 	function getComponents() {
// 		var deffered = $q.defer();
// 		$http.get('/api/components')
// 			.success(function(response) {
// 				deffered.resolve(response);
// 			});
// 		return deffered.promise; 	
// 	}

// 	function getSteps() {
// 		var deffered = $q.defer();
// 		$http.get('/api/steps')
// 			.success(function(response) {
// 				deffered.resolve(response);
// 			});
// 		return deffered.promise; 
// 	}


// 	function setComponents(data) {
// 		$scope.components = data;
		
// 	}

// 	function setSteps(data) {
// 		$scope.steps = data;
	
// 	}


	
// });