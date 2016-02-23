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

    $rootScope.scheduleDevice = {};

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
        modify_device: '/views/updDev.html',
        modify_profile: '/views/delDev.html'
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
}

;app.controller('adminViewCtrl',['$scope', '$rootScope', '$http', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $mdMedia, $mdDialog){

    //console.log('in adminViewCtrl - rootScope: ', $rootScope);


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

        if(option === 'modify_device'){

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

        if(option === 'modify_profile'){

            $http.get('/profiles')
                .then(function(response){
                    $rootScope.profiles = response.data;

                    $mdDialog.show(configDialog);
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                });

        }


    };


}]);

function AdminDialogController($scope, $mdDialog, $http, $rootScope, $location, $mdMedia) {

    //console.log('in adminDialogCtrl - rootScope: ', $rootScope);
    $scope.submit = function(choice, ev){

        //console.log('in AdminDialogController ', choice, $scope);

        if(choice === 'add_from_scan') {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            console.log('adding this device from scan ', $rootScope);
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

            console.log('in add device ', this.form);

            $http.post('/admin', this.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(choice === 'update_profile'){

            console.log('build code', this);

        }

        if(choice === 'delete_profile'){

            console.log('build code', this);

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

    console.log('in optionsCtrl ', $rootScope, this);

    $rootScope.scheduleDevice.dateBegin = new Date();

    $scope.apply = function(option){

        $rootScope.scheduleDevice.colour = $scope.color;
        $rootScope.scheduleDevice.hour = $scope.selectedHours.value;
        $rootScope.scheduleDevice.minute = $scope.selectedMinutes.value;

        function setOrRise() {
            console.log('function setOrRise', $rootScope);
                $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                    console.log('response from options/sun', response);
                });
        }

        function parseDate(date, hrs, mins, secs, ms){
            date.setHours(hrs);
            date.setMinutes(mins);
            date.setSeconds(secs);
            date.setMilliseconds(ms);

            return date;
        }


        if(option === 'colour'){

            $http.post('/options/colour', $rootScope.scheduleDevice)
                .then(function(response){
                    console.log('from options route', response);
                });

        }

        if(option === 'schedule') {

            if($rootScope.scheduleDevice.onAtSunset || $rootScope.scheduleDevice.offAtSunrise){

                //console.log('setting sunrise/sunset today');

                if($rootScope.scheduleDevice.dateEnd !== undefined) {

                    var dateBegin = parseDate($rootScope.scheduleDevice.dateBegin, 0, 0, 0, 0);
                    var dateEnd = parseDate($rootScope.scheduleDevice.dateEnd, 0, 0, 0, 0);
                    var days = (dateEnd - dateBegin) / 86400000;
                    console.log(days);
                }

                else if($rootScope.scheduleDevice.recurDaily) {

                    $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/sun', response);
                    });


                    var date = new Date();
                    date.setDate(date.getDate()+1);
                    date.setHours(3);
                    date.setMinutes(0);
                    date.setSeconds(0);


                    var delay = date - new Date();

                    console.log('setting up recurring sunrise/sunset schedule - calling setInterval every 24hrs from ', date);

                    if($rootScope.recurTimeOutID === undefined){

                        var recurTimeOut = setTimeout(function(){

                            console.log('settting upcoming sunset/sunrise control');
                            $rootScope.recurTimeOutID = recurTimeOut;
                            $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                                console.log('response from options/sun', response);
                            });
                            console.log('setting sunset/sunrise control every 24hrs');
                            var x = setInterval(setOrRise, 86400000);
                            $rootScope.scheduleDevice.intervalID = x;
                            clearTimeout(recurTimeOut);
                        }, delay);

                    }


                }

                else {

                    $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/sun', response);
                    });

                }


            }

            else {
                //$http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                //    $rootScope.scheduleDevice.sunset = response.data.results.sunset;
                //    $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
                //}).then(function(response){
                    $http.post('/options/schedule', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/schedule', response);
                    });
                //});

            }

        }

        if(option === 'profiles'){

            var devices;

            if(this.profile.profile.devices === null) {
                devices = [];
            } else {
                devices = this.profile.profile.devices;
            }
            //
            devices.push(this.scheduleDevice.mac);

            this.profile.profile.devices = devices;

            $http.post('/profiles', this.profile.profile)
                .then(function(response){
                    console.log(response);
                });

        }
         $rootScope.template.url = "/views/panel.html";
    };

    $scope.hours = [

        {name: 'Hr', value: 'null'},
        {name: 0, value: '0'},
        {name: 1, value: '1'},
        {name: 2, value: '2'},
        {name: 3, value: '3'},
        {name: 4, value: '4'},
        {name: 5, value: '5'},
        {name: 6, value: '6'},
        {name: 7, value: '7'},
        {name: 8, value: '8'},
        {name: 9, value: '9'},
        {name: 10, value: '10'},
        {name: 11, value: '11'},
        {name: 12, value: '12'},
        {name: 13, value: '13'},
        {name: 14, value: '14'},
        {name: 15, value: '15'},
        {name: 16, value: '16'},
        {name: 17, value: '17'},
        {name: 18, value: '18'},
        {name: 19, value: '19'},
        {name: 20, value: '20'},
        {name: 21, value: '21'},
        {name: 22, value: '22'},
        {name: 23, value: '23'}

    ];

    $scope.selectedHours = {name: 'Hr', value: 'null'};

    $scope.minutes = [
        {name: 'Min', value: 'null'},
        {name: 0, value: '0'},
        {name: 5, value: '5'},
        {name: 10, value: '10'},
        {name: 15, value: '15'},
        {name: 20, value: '20'},
        {name: 25, value: '25'},
        {name: 30, value: '30'},
        {name: 35, value: '35'},
        {name: 40, value: '40'},
        {name: 45, value: '45'},
        {name: 50, value: '50'},
        {name: 55, value: '55'}
    ];

    $scope.selectedMinutes = {name: 'Min', value: 'null'};

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

    $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
        $rootScope.scheduleDevice.sunset = response.data.results.sunset;
        $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
    });

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
        });

    $http.get('/profiles')
        .then(function(response){
            $rootScope.profiles = response.data;
        });

    var date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);

    var delay = date - new Date();

    function refreshSetOrRise() {
        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.scheduleDevice.sunset = response.data.results.sunset;
                $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
            });
        console.log('sunrise/sunset date updated. Sun rising at ' + response.data.results.sunrise + ' and setting at ' + response.data.results.sunset);

    }

    function riseSetDaily() {

        console.log($rootScope.runProfileTimerID);

        var set = $rootScope.profiles[0].profile;
        var rise = $rootScope.profiles[1].profile;

        for(var i = 0; i < set.devices.length; i++){
            console.log('turning on');
        }
    }

    if($rootScope.runProfileTimerID === undefined){

        var runProfileTimer = setTimeout(function(){

            $rootScope.runProfileTimerID = runProfileTimer;

            var recur = {};
            recur.set = $rootScope.profiles[0].profile.devices;
            recur.rise = $rootScope.profiles[1].profile.devices;
            recur.sunset = $rootScope.scheduleDevice.sunset;
            recur.sunrise = $rootScope.scheduleDevice.sunrise;

            date.setHours(3);

            $http.post('/options/profile_recur', recur)
                .then(function(response){
                    console.log(response);
                });

            var tmp = setTimeout(function(){
                $http.post('/options/profile_recur', recur)
                    .then(function(response){
                        console.log(response);
                    });

            var x = setInterval(riseSetDaily, 86400000);

                clearTimeout(tmp);
            }, delay);

            clearTimeout(runProfileTimer);

        }, 1000);


    }


    if($rootScope.refreshTimeOutID === undefined) {

        console.log('setting sunset/sunrise refresh timer');

        var refreshTimeOut = setTimeout(function(){
            $rootScope.refreshTimeOutID = refreshTimeOut;
            var x = setInterval(refreshSetOrRise, 86400000);
            console.log('refreshing sunrise/sunset data', $rootScope);
            clearTimeout(refreshTimeOut);
        }, delay);

    }

    $scope.newState = function(){

        $scope.device = this.panel.device;

        //console.log('newState ', this);

        $http.put('/panel', $scope.device)
            .then(function(response){
                $http.get('/panel')
                    .then(function(response){
                        $scope.panels = response.data;
                    });
            });

    };

    $scope.showOptions = function(url){
        //console.log('..changing to options view..', this);
        $rootScope.scheduleDevice = this.panel.device;
        $rootScope.template.url = $rootScope.template[url];
    };

    $scope.switch = function(url){
        //console.log('..loading option '+ url +' ..');
        $rootScope.template.url = $rootScope.template[url];

    };

    $scope.showAdvOptions = function(ev, option) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        //console.log('in showAdvOptions ', this);

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

