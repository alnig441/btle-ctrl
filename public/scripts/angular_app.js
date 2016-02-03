var app = angular.module('myApp', ['ngMaterial','ngRoute','ngAnimate']);

app.config(function($routeProvider, $locationProvider, $mdThemingProvider){

    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange',{
            'default': '500',
            'hue-1': '100',
            'hue-2': '900'
        })
        .accentPalette('blue-grey');

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


;app.controller('loginCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', '$mdMedia', function ($scope, $rootScope, $http, $location, $mdDialog, $mdMedia){

    $rootScope.template = '/views/panel.html';

    $rootScope.edinaa = {};

    $scope.logout = function(){
        $location.path('/default');
    };

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/views/login.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

}]);

function DialogController($scope, $mdDialog, $http, $location) {
    $scope.login = function() {
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/default');}
            });
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
};app.controller('adminCtrl',['$scope','$rootScope', '$http', function($scope, $rootScope, $http){

    $scope.addDev = function(){

        console.log('in adminCtrl addDev', this);
        $rootScope.form = this;
        console.log('HEJ DER!', $rootScope.form);
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

    $scope.setSchedule = function(url){

        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
            $rootScope.edina = response.data.results;
            var date = new Date($rootScope.edina.sunset);
            console.log('Sunset in Edina today: ', date);
        }).then(function(response){
            $http.post('/options/sun', $rootScope.edina).then(function(response){
                console.log('response from options/sun', response);
            });
        });

        $http.get('/options')
            .then(function(response){
                console.log(response);
            });

        $rootScope.template = '/views/panel.html';

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

        $rootScope.template = $rootScope.panelTemplate[url];

    };

}]);