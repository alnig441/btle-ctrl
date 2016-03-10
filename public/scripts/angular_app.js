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

    //console.log('in login Ctrl - rootScopes ', $rootScope);

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
        modify_profile: '/views/updProfile.html'
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

    console.log('in adminViewCtrl - rootScope: ', $rootScope);
    $rootScope.setpoint = {};

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

            $http.get('/profiles/all')
                .then(function(response){
                    //$rootScope.profiles = response.data;
                    $scope.profiles = response.data;
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

            console.log('in add device ');

            if(this.form.profile){
                console.log('we have profile');

                $http.post('/profiles/add', this.form.profile)
                    .then(function(response){
                        console.log(response);
                    });
            }

            if(this.form.device){
                console.log('we have a device');

                $http.post('/admin', this.form.device)
                    .then(function(response){
                        console.log(response);
                    });

            }


        }

        if(choice === 'update_profile'){

            var hour;
            var minute;

            if(this.profile.profile.active){
                if(this.profile.profile.sunset || this.profile.profile.sunrise){
                    hour = null;
                    minute = null;
                }
                else{
                    hour = this.form.setpoint.getHours();
                    minute = this.form.setpoint.getMinutes();
                }
            }
            if(!this.profile.profile.active){
                hour = null;
                minute = null;
            }
            this.profile.profile.hour = hour;
            this.profile.profile.minute = minute;
            //this.profile.profile.setpoint = null;

            $http.put('/profiles', this.profile)
                .then(function(response){
                    console.log(response);
                });

        }

        if(choice === 'delete_profile'){

            $http.delete('/profiles/' + this.profile.profile.profile_name)
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
};/**
 * Created by allannielsen on 3/3/16.
 */
;app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', function($scope, $rootScope, $http, $location, $mdDialog){

    //console.log('in optionsCtrl ', $rootScope, this);


    //Building scheduleDevice object with the required properties
    $rootScope.scheduleDevice.today = new Date();
    $rootScope.scheduleDevice.sunset = $rootScope.sun_data.sunset;
    $rootScope.scheduleDevice.sunrise = $rootScope.sun_data.sunrise;

    $scope.apply = function(option){

        for(var prop in $scope.form){
            $rootScope.scheduleDevice[prop] = $scope.form[prop];
        }

        $rootScope.scheduleDevice.colour = $scope.color;

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

                // Schedule sunset/sunrise range event
                if($rootScope.scheduleDevice.dateEnd !== undefined) {

                    console.log('TODO - write code');
                }


                // Schedule single sunset/sunrise event
                else {
                        $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/sun', response);

                    });

                }


            }

            // Schedule normal event
            else {
                    $http.post('/options/schedule', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/schedule', response);
                        $http.get('/panel')
                            .then(function(response){
                                $rootScope.panels = response.data;
                            });
                    });
            }

        }

        if(option === 'profiles'){

            var x = this.scheduleDevice.profiles;
            var mac = this.scheduleDevice.mac;

            x.forEach(function(elem, ind, arr){
                elem.mac = mac;

                $http.post('/profiles', elem)
                    .then(function(response){
                        console.log('from profiles route ', response);
                    });

            });


        }
         $rootScope.template.url = $rootScope.template.default;
    };

    $scope.turnDevOn = [
        {name: 'ON', value:  true},
        {name: 'OFF', value: false}
    ];

    $scope.color = {
        red: Math.floor(Math.random() * 255),
        green: Math.floor(Math.random() * 255),
        blue: Math.floor(Math.random() * 255)
    };

    $scope.dismiss = function() {
        $mdDialog.cancel();
    };


}]);

;app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', '$timeout', '$interval', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog, $timeout, $interval){

    console.log('in panelViewCtrl - rootScope: ', $rootScope);

    $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
        .then(function (response) {
            $rootScope.sun_data = response.data.results;
        });

    $http.get('/panel')
        .then(function(response){
            $rootScope.panels = response.data;
        });



    $http.get('/profiles')
        .then(function(response){
            $rootScope.activeProfiles = {};
            response.data.forEach(function(elem, ind, arr){
                $http.get('/profiles/' + elem.profile.profile_name)
                    .then(function(response){
                        $rootScope.activeProfiles[elem.profile.profile_name] = response.data;
                    });
            });
        });

    //Setting timeout delay to 1hr past midnight

    var date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);

    var delay = date - new Date();

    //Sunset/sunrise refresh data function - pulling fresh data every 24hrs and scheduling recurring profiles

    function refreshSunData() {

        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.sun_data = response.data.results;
            });

        console.log('Daily sunrise/sunset data update. SUNRISE: ' + new Date($rootScope.sun_data.sunrise) + ' / SUNSET: ' + new Date($rootScope.sun_data.sunset));

    }

    function recurDaily() {

        for(var prop in $rootScope.activeProfiles){
            for(var i = 0 ; i < $rootScope.activeProfiles[prop].length ; i ++){
                var date;

                if($rootScope.activeProfiles[prop][i].sunset || $rootScope.activeProfiles[prop][i].sunrise){

                    if($rootScope.activeProfiles[prop][i].sunset){
                        date = Date.parse(new Date($rootScope.sun_data.sunset));
                        date += i*1000;
                        $rootScope.activeProfiles[prop][i].sunset = date;
                    }
                    if($rootScope.activeProfiles[prop][i].sunrise){
                        date = Date.parse(new Date($rootScope.sun_data.sunrise));
                        date += i*1000;
                        $rootScope.activeProfiles[prop][i].sunrise = date;

                    }
                    $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);

                }
                else{
                    $rootScope.activeProfiles[prop][i].second = i;
                    $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);
                }
            }
        }

    }

    if($rootScope.recurDailyID === undefined){

        $rootScope.recurDailyID = setTimeout(function(){

            for(var prop in $rootScope.activeProfiles){

                    for(var i = 0 ; i < $rootScope.activeProfiles[prop].length ; i ++){

                        var date;

                        if($rootScope.activeProfiles[prop][i].sunset || $rootScope.activeProfiles[prop][i].sunrise){

                            if($rootScope.activeProfiles[prop][i].sunset){
                                date = Date.parse(new Date($rootScope.sun_data.sunset));
                                date += i*1000;
                                $rootScope.activeProfiles[prop][i].sunset = date;
                            }
                            if($rootScope.activeProfiles[prop][i].sunrise){
                                date = Date.parse(new Date($rootScope.sun_data.sunrise));
                                date += i*1000;
                                $rootScope.activeProfiles[prop][i].sunrise = date;

                            }
                            $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);

                        }
                        else{
                            $rootScope.activeProfiles[prop][i].second = i;
                            $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);
                        }
                    }
            }

            var tmp = setTimeout(function(){

                for(var prop in $rootScope.activeProfiles){

                    for(var i = 0 ; i < $rootScope.activeProfiles[prop].length ; i ++){
                        var date;

                        if($rootScope.activeProfiles[prop][i].sunset || $rootScope.activeProfiles[prop][i].sunrise){

                            if($rootScope.activeProfiles[prop][i].sunset){
                                date = Date.parse(new Date($rootScope.sun_data.sunset));
                                date += i*1000;
                                $rootScope.activeProfiles[prop][i].sunset = date;
                            }
                            if($rootScope.activeProfiles[prop][i].sunrise){
                                date = Date.parse(new Date($rootScope.sun_data.sunrise));
                                date += i*1000;
                                $rootScope.activeProfiles[prop][i].sunrise = date;

                            }
                            $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);

                        }
                        else{
                            $rootScope.activeProfiles[prop][i].second = i;
                            $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);
                        }
                    }
                }

                var x = setInterval(recurDaily, 86400000);
                clearTimeout(tmp);
            },delay);


            clearTimeout($rootScope.recurDailyID);
        }, 1000);
    }

    //if($rootScope.recurWeeklyID === undefined){
    //    console.log('write code for weekly recurring profiles');
    //
    //    $rootScope.recurWeeklyID = setTimeout(function(){
    //
    //        clearTimeout($rootScope.recurWeeklyID);
    //    }, 1500);
    //}

    //Running refreshTimeOut function when the associated ID on first page load, then scheduling recurring profiles

    if($rootScope.refreshSunDataID === undefined) {

        $rootScope.refreshSunDataID = setTimeout(function(){

            $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                $rootScope.sun_data = response.data.results;
                console.log('sunset/sunrise data refresh on load. SUNRISE: ' + new Date($rootScope.sun_data.sunrise) + ' / SUNSET: ' + new Date($rootScope.sun_data.sunset));
            });

            var tmp = setTimeout(function(){

                $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                    $rootScope.sun_data = response.data.results;
                });

                console.log('sunset/sunrise data refresh after initial delay. SUNRISE: ' + new Date($rootScope.sun_data.sunrise) + ' / SUNSET: ' + new Date($rootScope.sun_data.sunset));

                var x = setInterval(refreshSunData, 86400000);

                clearTimeout(tmp);

            }, delay);


            clearTimeout($rootScope.refreshSunDataID);
        }, 2500);

    }

    $scope.newState = function(){

        $http.put('/panel', this.panel.device)
            .then(function(response){
                console.log('response from /panel put: ', response);
            });

    };

    $scope.master = function(option){

        console.log('in scope.master: ', option, $rootScope.panels);


        var now = new Date();
        now.setSeconds(now.getSeconds()+5);
        now = Date.parse(now);

        if(option === 'on'){

            for(var i = 0 ; i < $rootScope.panels.length ; i ++, now += 1000){
                $rootScope.panels[i].device.date = now;
                $rootScope.panels[i].device.device_on = true;
                $http.post('/panel/master', $rootScope.panels[i].device);
            }

        }

        if(option === 'off'){

            for(var j = 0 ; j < $rootScope.panels.length ; j ++, now += 1000){
                $rootScope.panels[j].device.date = now;
                $rootScope.panels[j].device.device_on = false;
                $http.post('/panel/master', $rootScope.panels[j].device);
            }

        }

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

