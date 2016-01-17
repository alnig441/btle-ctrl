var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'adminCtrl'
        })
        .otherwise({redirectTo: '/panel'});
});


;app.controller('adminCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.mac = [];

}]);
;app.controller('panelCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

}]);