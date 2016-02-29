app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', '$timeout', '$interval', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog, $timeout, $interval){

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

        //$scope.device = this.panel.device;

        console.log('newState ', this.panel);

        //$http.get('/panel')
        //    .then(function(response){
        //        $rootScope.panels = response.data;
        //        $http.put('/panel', $scope.device)
        //            .then(function(response){
        //                console.log('response from /panel put: ', response);
        //            });
        //    });

        $http.put('/panel', this.panel.device)
            .then(function(response){
                console.log('response from /panel put: ', response);
                $http.get('/panel')
                    .then(function(response){
                        $rootScope.panels = response.data;
                    })
            });

    };

    $scope.master = function(choice){

        console.log('master switch: ', choice, $rootScope.panels);
        var date = new Date();
        date = Date.parse(date);

        if(choice === 'on'){

            for(var i = 0 ; i < $rootScope.panels.length ; i ++, date += 1000){
                $rootScope.panels[i].device.date = date;
                $rootScope.panels[i].device.device_on = false;
                $http.put('/panel', $rootScope.panels[i]);
            }
        }

        if(choice === 'off'){

            for(var j = 0 ; j < $rootScope.panels.length ; j ++, date += 1000){
                $rootScope.panels[j].device.date = date;
                $rootScope.panels[j].device.device_on = true;
                $http.put('/panel', $rootScope.panels[j]);
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

