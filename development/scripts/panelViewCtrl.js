app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $location, $mdMedia, $mdDialog){

    console.log('in panelViewCtrl - rootScope: ', $rootScope);

    $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
        $rootScope.scheduleDevice.sunset = response.data.results.sunset;
        $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
    });

    function refreshSetOrRise() {
        console.log('sunrise/sunset date updated');
        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.scheduleDevice.sunset = response.data.results.sunset;
                $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
            });
    }

    var date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);

    var delay = date - new Date();

    var timeOut = setTimeout(function(){
        console.log('refreshing sunrise/sunset data');
        var x = setInterval(refreshSetOrRise, 86400000);
    }, delay);

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
        });

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

