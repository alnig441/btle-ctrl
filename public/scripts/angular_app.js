var app = angular.module('myApp', ['ngMaterial','ngRoute','ngAnimate']);

app.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'adminViewCtrl'
        })
        .when('/default',{
            templateUrl: 'views/default.html',
            controller: 'panelViewCtrl'
        })
        .otherwise({redirectTo: '/default'});
});


;app.controller('loginCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $rootScope.template = '/views/panel.html';

    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/default');}
            });
    };

    $scope.logout = function(){
        $location.path('/default');
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
;app.controller('adminViewCtrl',['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    $rootScope.template = {
        default: '/views/panel.html',
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

            console.log('from adminViewCtrl add');

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

    $scope.return = function(){
        $rootScope.template = "/views/panel.html";
    };

}]);;app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){


    $rootScope.panelTemplate = {
        dim: '/views/dim.html',
        schedule: '/views/schedule.html',
        colour: '/views/colour.html',
        options: '/views/options.html',
        apply: '/views/default.html'
    };

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
            //console.log($scope.panels);
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
        $rootScope.template = $rootScope.panelTemplate[url];
    };

    $scope.switch = function(url){

        console.log('panelViewCtrl switch: ', url);
        $rootScope.template = $rootScope.panelTemplate[url];

    };

}]);