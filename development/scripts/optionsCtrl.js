app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', function($scope, $rootScope, $http, $location, $mdDialog){


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

