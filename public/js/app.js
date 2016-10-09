var app = angular.module('app', []);

app.controller('mainCtrl', function ($scope, $http, $q) {
	$scope.versions = [];
	$scope.components = [];
	$scope.steps = [];


	$q.all([
		getLastUpdate(),
		getComponents(),
		getSteps()
	]).then(function(data) {
		var version = data[0];
		var component = data[1];
		var step = data[2];

		setVersions(version);
		setComponents(component);
		setSteps(step);
	}).then(function() {
		setVersionNames();
		setVersionSteps();
	})

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
		console.log(data);
	}

	function setComponents(data) {
		$scope.components = data;
		console.log(data);
	}

	function setSteps(data) {
		$scope.steps = data;
		console.log(data);
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



});

app.controller('comCtrl', function($scope, $http, $q) {
	$scope.versions = [];
	$scope.components = [];
	$scope.steps = [];


	$q.all([
		getVersions(),
		getComponents(),
		getSteps()
	]).then(function(data) {
		var version = data[0];
		var component = data[1];
		var step = data[2];

		setVersions(version);
		setComponents(component);
		setSteps(step);
	}).then(function() {
		setVersionNames();
		setVersionSteps();
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
		console.log(data);
	}

	function setComponents(data) {
		$scope.components = data;
		console.log(data);
	}

	function setSteps(data) {
		$scope.steps = data;
		console.log(data);
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