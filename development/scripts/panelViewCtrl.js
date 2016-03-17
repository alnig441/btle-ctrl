app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', '$timeout', '$interval', 'profilesService', 'refreshService', 'jobService', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog, $timeout, $interval, profilesService, refreshService, jobService){

    //Setting timeout delay to 1hr past midnight
    console.log('In panelViewCtrl', $rootScope);

    var date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);

    var delay = date - new Date();

    //Sunset/sunrise refresh data function - pulling fresh data every 24hrs and scheduling recurring profiles
    function refreshSunData() {

        refreshService.sunData();
        console.log('Daily sunrise/sunset data update. SUNRISE: ' + new Date($rootScope.sun_data.sunrise) + ' / SUNSET: ' + new Date($rootScope.sun_data.sunset));

    }

    function runActiveProfiles() {

        console.log('Executing active profiles - daily');
        profilesService.runActive();

    }

    if($rootScope.recurDailyID === undefined) {

        refreshService.panels();
        profilesService.rebuildActive();


        $rootScope.recurDailyID = $timeout(function(){

            console.log('Executing profiles on load');
            profilesService.runActive();

            var tmp = $timeout(function(){

                console.log('Executing profiles after initial delay');
                profilesService.runActive();
                $interval(runActiveProfiles, 86400000);
                $timeout.cancel(tmp);
            }, delay);

            $timeout.cancel($rootScope.recurDailyID);
        },1000); //adding delay to allow for $rootScope.activeProfiles to build

    }


    //Running refreshTimeOut function when the associated ID on first page load, then scheduling recurring profiles

    if($rootScope.refreshSunDataID === undefined) {

        $rootScope.refreshSunDataID = $timeout(function() {

            refreshService.sunData();

            var tmp = $timeout(function () {

                refreshService.sunData();

                console.log('sunset/sunrise data refresh after initial delay. SUNRISE: ' + new Date($rootScope.sun_data.sunrise) + ' / SUNSET: ' + new Date($rootScope.sun_data.sunset));

                $interval(refreshSunData, 86400000);

                $timeout.cancel(tmp);

            }, delay);


            $timeout.cancel($rootScope.refreshSunDataID);
        });

    }

    $scope.newState = function(){

        $http.put('/panel', this.panel.device)
            .then(function(response){
                refreshService.panels();
            });

    };

    $scope.master = function(option){

        var now = new Date();
        now = Date.parse(now);

        if(option === 'on'){

            masterLoop: for(var i = 0 ; i < $rootScope.panels.length ; i ++, now += 1000){
                $rootScope.panels[i].device.date = now;
                $rootScope.panels[i].device.device_on = true;
                $http.post('/panel/master', $rootScope.panels[i].device);
            }

            refreshService.panels();
            jobService.getJobs();

        }

        if(option === 'off'){

            for(var j = 0 ; j < $rootScope.panels.length ; j ++, now += 1000){
                $rootScope.panels[j].device.date = now;
                $rootScope.panels[j].device.device_on = false;
                $http.post('/panel/master', $rootScope.panels[j].device);
            }

            refreshService.panels();
            jobService.getJobs();

        }

    };

    $scope.showOptions = function(url){
        $rootScope.scheduleDevice = this.panel.device;
        $rootScope.template.url = $rootScope.template[url];
    };

    $scope.switch = function(url){
        $rootScope.template.url = $rootScope.template[url];

    };

    $scope.showAdvOptions = function(ev, option) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

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
    //console.log('..this merely opens the dialog window...');

}

