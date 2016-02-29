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

    //console.log('in optionsCtrl ', $rootScope, this);


    //Building scheduleDevice object with the required properties

    $rootScope.scheduleDevice.dateBegin = new Date();
    $rootScope.scheduleDevice.sunset = $rootScope.sunset;
    $rootScope.scheduleDevice.sunrise = $rootScope.sunrise;

    $scope.apply = function(option){

        $rootScope.scheduleDevice.colour = $scope.color;
        $rootScope.scheduleDevice.hour = $scope.selectedHours.value;
        $rootScope.scheduleDevice.minute = $scope.selectedMinutes.value;

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

            //console.log('in options profile ', this.scheduleDevice);

            $http.post('/profiles', this.scheduleDevice)
                .then(function(response){
                    console.log('from profiles route ', response);
                });

        }
         $rootScope.template.url = $rootScope.template.default;
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

;app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', '$timeout', '$interval', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog, $timeout, $interval){

    console.log('in panelViewCtrl - rootScope: ', $rootScope);

    $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
        .then(function (response) {
            $rootScope.sunset = response.data.results.sunset;
            $rootScope.sunrise = response.data.results.sunrise;
        });

    $http.get('/panel')
        .then(function(response){
            $rootScope.panels = response.data;
        });

    $http.get('/profiles/on_at_sunset')
        .then(function(response){
            $rootScope.on_at_sunset = response.data;
        })
        .then(function(){
        for(var i = 0; i < $rootScope.on_at_sunset.length; i++){
            $rootScope.on_at_sunset[i].sunset = $rootScope.sunset;
        }
        });

    $http.get('/profiles/off_at_sunrise')
        .then(function(response){
            $rootScope.off_at_sunrise = response.data;
        })
        .then(function(){
            for(var i = 0; i < $rootScope.off_at_sunrise.length; i++){
                $rootScope.on_at_sunset[i].sunrise = $rootScope.sunrise;
            }
        });

    $http.get('/profiles/master_off')
        .then(function(response){
            $rootScope.master_off = response.data;
        });

    //Setting timeout delay to 1hr past midnight

    var date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);

    var delay = date - new Date();

    //Sunset/sunrise refresh data function - pulling fresh data every 24hrs and scheduling recurring profiles

    function refreshSetOrRise() {
        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.sunset = response.data.results.sunset;
                $rootScope.sunrise = response.data.results.sunrise;
            }).then(function(response){
            if(new Date() < new Date($rootScope.sunset)){
                var setpoint = new Date($rootScope.sunset);
                setpoint = Date.parse(setpoint);
                for(var i = 0 ; i < $rootScope.on_at_sunset.length ; i ++){
                    setpoint = +1000;
                    $rootScope.on_at_sunset[i].sunset = setpoint;
                    $rootScope.on_at_sunset[i].off_at_sunrise = false;
                    $rootScope.on_at_sunset[i].master_off = false;
                    $http.post('/options/profile_recur', $rootScope.on_at_sunset[i]);
                }
            }
        }).then(function(response){
            if(new Date() < new Date($rootScope.sunrise)){
                var setpoint = new Date($rootScope.sunrise);
                setpoint = Date.parse(setpoint);
                for(var j = 0 ; j < $rootScope.off_at_sunrise.length ; j ++) {
                    setpoint = 1000;
                    $rootScope.off_at_sunrise[j].sunrise = setpoint;
                    $rootScope.off_at_sunrise[j].on_at_sunset = false;
                    $rootScope.off_at_sunrise[j].master_off = false;
                    $http.post('/options/profile_recur', $rootScope.off_at_sunrise[j]);
                }
            }
        });
        console.log('Daily sunrise/sunset data update. SUNRISE: ' + new Date($rootScope.sunrise) + ' / SUNSET: ' + new Date($rootScope.sunset));

    }


    //Running refreshTimeOut function when the associated ID on first page load, then scheduling recurring profiles

    if($rootScope.refreshTimeOutID === undefined) {

        var refreshTimeOut = setTimeout(function(){

            $rootScope.refreshTimeOutID = refreshTimeOut;

            $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                $rootScope.sunset = response.data.results.sunset;
                $rootScope.sunrise = response.data.results.sunrise;
                console.log('sunset/sunrise data refresh on load. SUNRISE: ' + new Date($rootScope.sunrise) + ' / SUNSET: ' + new Date($rootScope.sunset));
            }).then(function(response){
                if(new Date() < new Date($rootScope.sunset)){
                    var setpoint = new Date($rootScope.sunset);
                    setpoint = Date.parse(setpoint);
                    for(var i = 0 ; i < $rootScope.on_at_sunset.length ; i ++){
                        setpoint += 1000;
                        $rootScope.on_at_sunset[i].sunset = setpoint;
                        $rootScope.on_at_sunset[i].off_at_sunrise = false;
                        $rootScope.on_at_sunset[i].master_off = false;
                        $http.post('/options/profile_recur', $rootScope.on_at_sunset[i]);
                    }
                }
            }).then(function(response){
                if(new Date() < new Date($rootScope.sunrise)){
                    var setpoint = new Date($rootScope.sunrise);
                    setpoint = Date.parse(setpoint);
                    for(var j = 0 ; j < $rootScope.off_at_sunrise.length ; j ++) {
                        setpoint += 1000;
                        $rootScope.off_at_sunrise[j].sunrise = setpoint;
                        $rootScope.off_at_sunrise[j].on_at_sunset = false;
                        $rootScope.off_at_sunrise[j].master_off = false;
                        $http.post('/options/profile_recur', $rootScope.off_at_sunrise[j]);
                    }
                }
            });

            //console.log('refreshTimeOut timer - rootscope ', $rootScope);

            var tmp = setTimeout(function(){

                $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                    $rootScope.sunset = response.data.results.sunset;
                    $rootScope.sunrise = response.data.results.sunrise;
                }).then(function(response){
                    if(new Date() < new Date($rootScope.sunset)){
                        var setpoint = new Date($rootScope.sunset);
                        setpoint = Date.parse(setpoint);
                        for(var i = 0 ; i < $rootScope.on_at_sunset.length ; i ++){
                            setpoint += 1000;
                            $rootScope.on_at_sunset[i].sunset = setpoint;
                            $rootScope.on_at_sunset[i].off_at_sunrise = false;
                            $rootScope.on_at_sunset[i].master_off = false;
                            $http.post('/options/profile_recur', $rootScope.on_at_sunset[i]);
                        }
                    }
                }).then(function(response){
                    if(new Date() < new Date($rootScope.sunrise)){
                        var setpoint = new Date($rootScope.sunrise);
                        setpoint = Date.parse(setpoint);
                        for(var j = 0 ; j < $rootScope.off_at_sunrise.length ; j ++) {
                            setpoint += 1000;
                            $rootScope.off_at_sunrise[j].sunrise = setpoint;
                            $rootScope.off_at_sunrise[j].on_at_sunset = false;
                            $rootScope.off_at_sunrise[j].master_off = false;
                            $http.post('/options/profile_recur', $rootScope.off_at_sunrise[j]);
                        }
                    }
                });

                console.log('sunset/sunrise data refresh after initial delay. SUNRISE: ' + new Date($rootScope.sunrise) + ' / SUNSET: ' + new Date($rootScope.sunset));

                var x = setInterval(refreshSetOrRise, 86400000);

                clearTimeout(tmp);

            }, delay);


            clearTimeout(refreshTimeOut);
        }, 2500);

    }

    $scope.newState = function(){

        console.log('newState ', this.panel.device, $rootScope);

        $http.put('/panel', this.panel.device)
            .then(function(response){
                console.log('response from /panel put: ', response);
                $http.get('/panel')
                    .then(function(response){
                        $rootScope.temp = response.data;
                        $rootScope.panels = $rootScope.temp;
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

