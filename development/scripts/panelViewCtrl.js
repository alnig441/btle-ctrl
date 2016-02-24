app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog){

    console.log('panelViewCtrl rootscope ', $rootScope);

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
        });

    $http.get('/profiles')
        .then(function(response){
            $rootScope.profiles = response.data;
        });

    //Setting timeout delay to 1hr past midnight

    var date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);

    var delay = date - new Date();

    //Sunset/sunrise refresh data function - pulling fresh data every 24hrs

    function refreshSetOrRise() {
        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.sunset = response.data.results.sunset;
                $rootScope.sunrise = response.data.results.sunrise;
            });
        console.log('Daily sunrise/sunset data update. SUNRISE: ' + new Date($rootScope.sunrise) + ' / SUNSET: ' + new Date($rootScope.sunset));

    }

    //function riseSetDaily() {
    //
    //    console.log($rootScope.runProfileTimerID);
    //
    //    var set = $rootScope.profiles[0].profile;
    //    var rise = $rootScope.profiles[1].profile;
    //
    //    for(var i = 0; i < set.devices.length; i++){
    //        console.log('turning on');
    //    }
    //}
    //
    //if($rootScope.runProfileTimerID === undefined){
    //
    //    var runProfileTimer = setTimeout(function(){
    //
    //        $rootScope.runProfileTimerID = runProfileTimer;
    //
    //        var recur = {};
    //        recur.set = $rootScope.profiles[0].profile.devices;
    //        recur.rise = $rootScope.profiles[1].profile.devices;
    //        recur.sunset = $rootScope.scheduleDevice.sunset;
    //        recur.sunrise = $rootScope.scheduleDevice.sunrise;
    //
    //        date.setHours(3);
    //
    //        $http.post('/options/profile_recur', recur)
    //            .then(function(response){
    //                console.log(response);
    //            });
    //
    //        var tmp = setTimeout(function(){
    //            $http.post('/options/profile_recur', recur)
    //                .then(function(response){
    //                    console.log(response);
    //                });
    //
    //        var x = setInterval(riseSetDaily, 86400000);
    //
    //            clearTimeout(tmp);
    //        }, delay);
    //
    //        clearTimeout(runProfileTimer);
    //
    //    }, 1000);
    //
    //
    //}

    //Running refreshTimeOut function when the associated ID is undefined, i.e. on first page load only.

    if($rootScope.refreshTimeOutID === undefined) {

        var refreshTimeOut = setTimeout(function(){

            $rootScope.refreshTimeOutID = refreshTimeOut;

            $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                $rootScope.sunset = response.data.results.sunset;
                $rootScope.sunrise = response.data.results.sunrise;
                console.log('sunset/sunrise data refresh on load. SUNRISE: ' + new Date($rootScope.sunrise) + ' / SUNSET: ' + new Date($rootScope.sunset));
            });

            console.log('refreshTimeOut timer - rootscope ', $rootScope);

            var tmp = setTimeout(function(){

                $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                    $rootScope.sunset = response.data.results.sunset;
                    $rootScope.sunrise = response.data.results.sunrise;
                });

                console.log('sunset/sunrise data refresh after initial dealy. SUNRISE: ' + new Date($rootScope.sunrise) + ' / SUNSET: ' + new Date($rootScope.sunset));

                var x = setInterval(refreshSetOrRise, 86400000);

                clearTimeout(tmp);

            }, delay);


            clearTimeout(refreshTimeOut);
        }, 2500);

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

