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

    console.log('loginCtrl: ', $scope);

    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                console.log('response from post: ', response);
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

    $scope.mac = [];

}]);
;app.controller('panelCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

}]);