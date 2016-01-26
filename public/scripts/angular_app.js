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
;app.controller('adminCtrl',['$scope','$rootScope', '$http', function($scope, $rootScope, $http){

    $scope.scanDev = function(url){

    };

    $scope.addDev = function(){

        $scope.form = this;
        $rootScope.template.url = $rootScope.template.add;

    };

    $scope.updateDev = function(url){

    };

    $scope.deleteDev = function(url){

    };

    $scope.submit = function(str){

        console.log('form submission from: ', str, $scope.form);

        if(str == 'add'){

            $http.post('/admin', $scope.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(str == 'delete'){


        }

        if(str == 'update'){

        }

    };

}]);
;/**
 * Created by allannielsen on 1/26/16.
 */
;app.controller('panelCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
            console.log($scope.panels);
        });

    $scope.newState = function(){

        $scope.device = this.panel.device;

        $http.put('/panel', $scope.device)
            .then(function(response){
                $http.get('/panel')
                    .then(function(response){
                        $scope.panels = response.data;
                    });
            });

    };

    $scope.showOptions = function(){

    };

}]);;app.controller('viewPaneCtrl',['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    $rootScope.template = {
        default: '/views/default.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };
    $rootScope.template.url = $rootScope.template.default;

    $scope.switch = function(url){

        $rootScope.template.url = $rootScope.template[url];

        if(url == 'scan'){

            $http.get('/admin/scan', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;
                })
                .then(function(){
                    $http.get('/admin/reset')
                        .then(function(response){
                            console.log(response);
                        });

                });

        }

        if(url == 'add'){

        }

        if(url == 'delete'){

            $http.get('/admin/test', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;
                });

        }

        if(url == 'update'){

            $http.get('/admin/test', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;
                });

        }

        if(url == 'test'){


        }
    };


}]);
