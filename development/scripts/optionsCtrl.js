app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', 'refreshService', 'jobService', function($scope, $rootScope, $http, $location, $mdDialog, refreshService, jobService){

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
        $rootScope.scheduleDevice.dim = $scope.dim;

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

            console.log('...scheduling...', this.scheduleDevice, this.form.create_profile);

            if($rootScope.scheduleDevice.onAtSunset || $rootScope.scheduleDevice.offAtSunrise){

                // Schedule sunset/sunrise range event
                if($rootScope.scheduleDevice.dateEnd !== undefined) {

                    console.log('TODO - write code');
                }


                // Schedule single sunset/sunrise event
                else {
                    //check if new profiles is to be created before scheduling individual job
                    if(this.form.active){
                        if(this.form.onAtSunset){
                            this.form.sunset = true;
                        }
                        if(this.form.offAtSunrise){
                            this.form.sunrise = true;
                        }
                        $http.post('/profiles/add', this.form)
                            .then(function(response){
                                refreshService.panels();
                                jobService.getJobs();
                            });


                    }
                        $http.post('/options/sun', $rootScope.scheduleDevice)
                            .then(function(response){
                                //console.log('response from options/sun', response);
                                jobService.getJobs();
                    });

                }


            }

            // Schedule normal event
            else {
                //check if new profiles is to be created before scheduling individual job
                if(this.form.active){
                    this.form.hour = this.form.setpoint.getHours();
                    this.form.minute = this.form.setpoint.getMinutes();
                    $http.post('/profiles/add', this.form)
                        .then(function(response){
                            refreshService.panels();
                    });

                }

                $http.post('/options/schedule', $rootScope.scheduleDevice)
                    .then(function(response){
                        //console.log('response from options/schedule', response);
                        jobService.getJobs();
                    });
            }

        }

        if(option === 'profiles'){

            $rootScope.recurDailyID = undefined;

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

    $scope.turn_on = [
        {name: 'ON', value:  true},
        {name: 'OFF', value: false}
    ];

    $scope.color = {
        red: Math.floor(Math.random() * 255),
        green: Math.floor(Math.random() * 255),
        blue: Math.floor(Math.random() * 255)
    };

    $scope.dim = {
      brightness: Math.floor(Math.random()*10)
    };

    $scope.dismiss = function() {
        $mdDialog.cancel();
    };


}]);

