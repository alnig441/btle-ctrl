app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', '$timeout', '$interval', 'profilesService', 'sunDataService', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog, $timeout, $interval, profilesService, sunDataService){

    console.log('in panelViewCtrl - rootScope: ', $rootScope);

    sunDataService.refresh();

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

        sunDataService.refresh();

        console.log('Daily sunrise/sunset data update. SUNRISE: ' + new Date($rootScope.sun_data.sunrise) + ' / SUNSET: ' + new Date($rootScope.sun_data.sunset));

    }

    function recurDaily() {

        console.log('Executing active profiles - daily');
        profilesService.run();

    }

    if($rootScope.recurDailyID === undefined){

        $rootScope.recurDailyID = setTimeout(function(){

            console.log('Executing active profiles on load');
            profilesService.run();

            var tmp = setTimeout(function(){

                profilesService.run();
                var x = setInterval(recurDaily, 86400000);
                clearTimeout(tmp);
            },delay);

            clearTimeout($rootScope.recurDailyID);
        }, 1000);
    }

    //Running refreshTimeOut function when the associated ID on first page load, then scheduling recurring profiles

    if($rootScope.refreshSunDataID === undefined) {

        $rootScope.refreshSunDataID = setTimeout(function(){

            sunDataService.refresh();

            var tmp = setTimeout(function(){

                sunDataService.refresh();

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

