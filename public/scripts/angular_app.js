var app = angular.module('myApp', ['ngRoute','ngAnimate']);

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
;app.controller('adminCtrl',['$scope','$rootScope', '$http', '$location', '$compile', function($scope, $rootScope, $http, $location, $compile){

    $rootScope.template = {
        default: '/views/default.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };
    $rootScope.template.url = $rootScope.template.default;


    $scope.scanDev = function(url){

        $rootScope.template.url = $rootScope.template[url];

        $http.get('/admin/scan', $scope)
            .then(function(response){
                //$scope.devices = response.data;
                //console.log(response);
            })
            .then(function(){
                $http.get('/admin/reset')
                    .then(function(response){
                        //console.log(response);
                    });

            });

    };



    $scope.addDev = function(url){

        $rootScope.template.url = $rootScope.template[url];
    };

    $scope.updateDev = function(url){

        $rootScope.template.url = $rootScope.template[url];

    };

    $scope.deleteDev = function(url){

        $rootScope.template.url = $rootScope.template[url];

    };

}]);
;app.controller('panelCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.newState = function(){

    };

    $scope.showOptions = function(){

    };

}]);;app.controller('viewPaneCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){
    $scope.template.url = '/views/scanDev.html';
    console.log($scope.template[url]);

}]);
