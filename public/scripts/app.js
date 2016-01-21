var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'adminCtrl'
        })
        .when('/panel',{
            templateUrl: 'views/panel.html',
            controller: 'panelCtrl'
        })
        .otherwise({redirectTo: '/panel'});
});


;app.controller('loginCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/panel');}
            });
    };

    $scope.logout = function(){
        $location.path('/panel');
    };
}]);
;app.controller('adminCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.scanDev = function(){
        $http.get('/admin/scan')
            .then(function(response){
                console.log(response);
            })
            .then(function(){
                $http.get('/admin/reset')
                    .then(function(response){
                        console.log(response);
                    });

            });

    };

    $scope.addDev = function(){

    };

    $scope.updateDev = function(){

    };

    $scope.deleteDev = function(){

    };

}]);
;app.controller('panelCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.newState = function(){

    };

    $scope.showOptions = function(){

    };

}]);