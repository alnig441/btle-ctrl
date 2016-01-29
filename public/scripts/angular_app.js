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


;app.controller('loginCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $rootScope.template = '/views/default.html';

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

    $scope.addDev = function(){

        $scope.form = this;
        $rootScope.template.url = $rootScope.template.add;

    };

    $scope.testDev = function(){

        var device = {
            mac: this.device.mac,
            state: true
        };

        var x = setInterval(runTest, 1000);
        var state;

        function runTest() {
            $http.post('/admin/test/', device )
                .then(function (response) {
                    device.state = response.data;

                });
        }

        var y = setTimeout(killX, 5000);

        function killX(){
            console.log('test interval cleared');
            clearInterval(x);
        }


    };

    $scope.submit = function(str){

        console.log('form submission from: ', str, this.installation, $scope);

        if(str == 'add'){

            $http.post('/admin', $scope.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(str == 'delete'){

            $http.delete('/admin/' + this.installation.device.mac)
                .then(function(response){
                    $http.get('/panel')
                        .then(function(response){
                            $rootScope.installations = response.data;
                            console.log(response);
                        });
                });

        }

        if(str == 'update'){

            $http.post('/admin/update', this.installation.device)
                .then(function(response){
                    console.log(response);
                });

        }

    };

}]);
;/**
 * Created by allannielsen on 1/26/16.
 */
;app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $scope.setSchedule = function(){

        console.log('in optionsCtrl');

        $http.get('/options')
            .then(function(response){
                console.log(response);
            });
    };

    $scope.apply = function(url){

        $rootScope.template = url;
    };

}]);;app.controller('panelCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
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

    $scope.showOptions = function(url){
        console.log('from panelCtrl: ', url);
        $rootScope.template = url;
    };

}]);;app.controller('viewPaneCtrl',['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    $rootScope.template = {
        default: '/views/default.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };

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

            console.log('from viewPaneCtrl add');

        }

        if(url == 'delete'){

            $http.get('/panel')
                .then(function(response){
                    $rootScope.installations = response.data;
                });

        }

        if(url == 'update'){

            $http.get('/panel')
                .then(function(response){
                    $rootScope.installations = response.data;
                });


        }

    };


}]);
