app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', function($scope, $rootScope, $http, $location, $mdDialog){

    //console.log('in optionsCtrl ', $rootScope, this);


    //Building scheduleDevice object with the required properties
    $rootScope.scheduleDevice.today = new Date();
    $rootScope.scheduleDevice.sunset = $rootScope.sunset;
    $rootScope.scheduleDevice.sunrise = $rootScope.sunrise;

    $scope.apply = function(option){

        console.log('allo allo: ', $scope.form);

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

