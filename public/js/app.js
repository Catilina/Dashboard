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

		.otherwise({
			redirectTo: '/'
		});

		// enable html5Mode for pushstate ('#'-less URLs)
	    $locationProvider.html5Mode(true);
	    $locationProvider.hashPrefix('!');
});

// custom filter for pagination
app.filter('startFrom', function() {
	return function(data, start) {
		return data.slice(start);
	}
});
// controller for the navigation bar to change the active class for links
app.controller('routeCtrl', function ($scope, $location) {
	$scope.isActive = function(route) {
        return route === $location.path();
    }

	    $scope.closeNav = function() {
	    	if (window.innerWidth <= 768 ) {
					$('.navbar-toggle').click();
			}


    }

});

// controller for the home page
app.controller('mainCtrl', function ($scope, $http, $q) {
	$scope.versions = [];
	$scope.steps = [];
	$scope.stepStats = [];
	$scope.statusStats = [];
	$scope.showLoader = true;

	// handle the defered promises to make sure all info comes back in order
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
		// draw google charts
		google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawStepChart);
    google.charts.setOnLoadCallback(drawStatusChart);
		// remove the loading image from view
		$scope.showLoader = false;
	})



			/*
				Draws the google chart with component step info
			*/
      function drawStepChart() {
        var data = new google.visualization.DataTable();
          data.addColumn('string', 'Pipeline Steps');
          data.addColumn('number', 'Amount of Components');
          data.addRows($scope.stepStats.length);

          for (var i = 0; i < $scope.stepStats.length; i++) {
          		data.setCell(i, 0, $scope.stepStats[i].step_name);
          		data.setCell(i, 1, $scope.stepStats[i].amount);
          }


        var options = {
          title: 'Amount of Components per Pipeline Step',
          bar: {groupWidth: "50%"},
          legend: { position: "none" },

        };

        var chart = new google.visualization.ColumnChart(document.getElementById('donutchart'));
        chart.draw(data, options);
				// redraw the chart when window resizes to make it responsive
        $(window).resize(function () {
    			chart.draw(data, options);
				});
      }

			/*
				Draws the google chart with componet status info
			*/
      function drawStatusChart() {
        var data = google.visualization.arrayToDataTable([
          ['Step Results', 'Amount of Components'],
          [$scope.statusStats[0].status_name, $scope.statusStats[0].amount],
          [$scope.statusStats[1].status_name, $scope.statusStats[1].amount],
          [$scope.statusStats[2].status_name, $scope.statusStats[2].amount]
        ]);

        var options = {
          title: 'Percentage of Components per Status',
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart2'));
        chart.draw(data, options);

        $(window).resize(function () {
    			chart.draw(data, options);
				});
      }

	/*
		Get the update information from the api and defer the response
		to be handled later
	*/
	function getLastUpdate() {
		var deffered = $q.defer();
		$http.get('/api/update')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise;
	}

	/*
		Get the component step information from the api and defer the response
		to be handled later
	*/
	function getSteps() {
		var deffered = $q.defer();
		$http.get('/api/steps')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise;
	}

	/*
		Save the component version information to the scope from getLastUpdate request
	*/
	function setVersions(data) {
		$scope.versions = data;

	}

	/*
		Save the component step information to the scope from getSteps request
	*/
	function setSteps(data) {
		$scope.steps = data;

	}

	/*
		Save the component step stats information to the scope from getLastUpdate request
	*/
	function setStepStats(data) {
		$scope.stepStats = data;

	}

	/*
		Save the component status stats information to the scope from getLastUpdate request
	*/
	function setStatusStats(data) {
		$scope.statusStats = data;
	}


});

// controller for the components page
app.controller('comCtrl', function($scope, $http, $q) {
	$scope.versions = [];
	$scope.components = [];
	$scope.pageSize = 15;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.tableData = [];
	$scope.selectComponent = 'All Components';
	$scope.showLoader = true;

	// handle the defered promises to make sure all info comes back in order
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

	/*
		Get the component version information from the api and defer the response
		to be handled later
	*/
	function getVersions() {
		var deffered = $q.defer();
		$http.get('/api/versions')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise;
	}

	/*
		Get the component information from the api and defer the response
		to be handled later
	*/
	function getComponents() {
		var deffered = $q.defer();
		$http.get('/api/components')
			.success(function(response) {
				deffered.resolve(response);
			});
		return deffered.promise;
	}


	/*
		Save the component version information to the scope from getVersions request
	*/
	function setVersions(data) {
		$scope.versions = data;

	}
	/*
		Save the component information to the scope from getComponents request
	*/
	function setComponents(data) {
		$scope.components = data;

	}


	/*
		Filter the information in the table by the component name (data)
	*/
	$scope.getTableData = function(data) {

		if (data === 'All Components') {
			$scope.tableData = $scope.versions;
		} else {

			var results = [];
			for (var i = 0; i < $scope.versions.length; i++) {
				if ($scope.versions[i].component_name === data) {
					results.push($scope.versions[i]);
				}
			}

			$scope.tableData = results;
		}


	}
});
