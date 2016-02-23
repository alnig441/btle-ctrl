app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog){

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

