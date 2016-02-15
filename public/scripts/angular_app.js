var app = angular.module('myApp', ['ngMaterial','ngRoute','ngAnimate']);

app.config(function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider){

    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange',{
            'default': '700',
            'hue-1': '100',
            'hue-2': '900'
        })
        .backgroundPalette('blue-grey', {
            'default': '100',
            'hue-1': '50',
            'hue-2': '900'
    });

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

    $mdIconProvider
        .defaultIconSet('https://fonts.googleapis.com/icon?family=Material+Icons');       // Register a default set of SVG icons

});


;app.controller('loginCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', '$mdMedia', function ($scope, $rootScope, $http, $location, $mdDialog, $mdMedia){

    console.log('in login Ctrl - rootScopes ', $rootScope);


    $rootScope.template = {
        dim: '/views/dim.html',
        schedule: '/views/schedule.html',
        colour: '/views/colour.html',
        options: '/views/options.html',
        profiles: '/views/profiles.html',
        apply: '/views/default.html',
        default: '/views/panel.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };


    $rootScope.template.url = '/views/panel.html';

    $scope.logout = function(){
        $location.path('/default');
    };

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
                controller: LoginDialogController,
                templateUrl: '/views/loginDialog.html',
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

function LoginDialogController($scope, $mdDialog, $http, $location, $rootScope) {

    console.log('in LoginDialogCtrl - rootScope: ', $rootScope);

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
    $scope.dismiss = function() {
        $mdDialog.cancel();
    };
};app.controller('adminViewCtrl',['$scope', '$rootScope', '$http', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $mdMedia, $mdDialog){

    console.log('in adminViewCtrl - rootScope: ', $rootScope);


    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev, option) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        var configDialog = {
            scope: $scope,
            preserveScope: true,
            controller: AdminDialogController,
            templateUrl: $rootScope.template[option],
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        };

        if(option === 'delete' || option === 'update'){

            $http.get('/panel')
                .then(function(response){
                    $scope.installations = response.data;

                    $mdDialog.show(configDialog);
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                });



        }

        if(option === 'add'){

            $mdDialog.show(configDialog);
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

        }

        if(option === 'scan'){

            $http.get('/admin/scan', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;

                    $mdDialog.show(configDialog);
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                })
                .then(function(){
                    $http.get('/admin/reset')
                        .then(function(response){
                            console.log(response);
                        });

                });

        }



    };


}]);

function AdminDialogController($scope, $mdDialog, $http, $rootScope, $location, $mdMedia) {

    console.log('in adminDialogCtrl - rootScope: ', $rootScope);


    $scope.submit = function(choice, ev){

        console.log('in AdminDialogController ', choice, $scope);

        if(choice === 'add_from_scan') {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            console.log('adding this device from scan ', this.device);
            $rootScope.form = this;

            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                controller: AdminDialogController,
                templateUrl: $rootScope.template.add,
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
        }

        if(choice === 'delete') {

            $http.delete('/admin/' + this.installation.device.mac)
                .then(function(response){
                    $http.get('/panel')
                        .then(function(response){
                            $rootScope.installations = response.data;
                            console.log(response);
                        });
                });

        }

        if(choice === 'update') {

            $http.post('/admin/update', this.installation.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(choice === 'add') {

            $http.post('/admin', this.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        $mdDialog.hide();
    };

    $scope.testDev = function() {

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

        var y = setTimeout(killX, 6000);

        function killX(){
            console.log('test interval cleared');
            clearInterval(x);
        }

    };

    $scope.dismiss = function() {
        $mdDialog.cancel();
    };
};app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', function($scope, $rootScope, $http, $location, $mdDialog){


    $scope.apply = function(option){
        console.log('in options ctrl - function apply',option, $rootScope);

        $rootScope.scheduleDevice.colour = $scope.color;

        if(option === 'colour'){

            $http.post('/options/colour', $rootScope.scheduleDevice)
                .then(function(response){
                    console.log('from options route', response);
                });

        }

        if(option === 'schedule') {

            $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                $rootScope.scheduleDevice.sunset = response.data.results.sunset;
                $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
            }).then(function(response){
                $http.post('/options/schedule', $rootScope.scheduleDevice).then(function(response){
                    console.log('response from options/schedule', response);
                });
            });

        }

        $rootScope.template.url = "/views/panel.html";
    };

    $scope.color = {
        red: Math.floor(Math.random() * 255),
        green: Math.floor(Math.random() * 255),
        blue: Math.floor(Math.random() * 255)
    };

    $scope.dismiss = function() {
        $mdDialog.cancel();
    };




}]);

;app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog){

    console.log('in panelViewCtrl - rootScope: ', $rootScope);

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
        });

    $scope.newState = function(){

        $scope.device = this.panel.device;

        console.log('newState ', this);

        $http.put('/panel', $scope.device)
            .then(function(response){
                $http.get('/panel')
                    .then(function(response){
                        $scope.panels = response.data;
                    });
            });

    };

    $scope.showOptions = function(url){
        console.log('..changing to options view..', this);
        $rootScope.scheduleDevice = this.panel.device;
        $rootScope.template.url = $rootScope.template[url];
    };

    $scope.switch = function(url){
        console.log('..loading option '+ url +' ..');
        $rootScope.template.url = $rootScope.template[url];

    };

    $scope.showAdvOptions = function(ev, option) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        console.log('in showAdvOptions ', this);

        var configDialog = {
            scope: $scope,
            preserveScope: true,
            controller: OptionsDialogController,
            templateUrl: $rootScope.template[option],
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        };

        $mdDialog.show(configDialog);
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });


    };


}]);

function OptionsDialogController($scope, $mdDialog, $http, $rootScope, $location, $mdMedia) {
    console.log('..this merely opens the dialog window...');
}