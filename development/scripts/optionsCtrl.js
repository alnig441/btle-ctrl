app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', function($scope, $rootScope, $http, $location, $mdDialog){

    //console.log('in optionsCtrl ', $rootScope, this);

    $rootScope.scheduleDevice.dateBegin = new Date();

    $scope.apply = function(option){

        $rootScope.scheduleDevice.colour = $scope.color;
        $rootScope.scheduleDevice.hour = $scope.selectedHours.value;
        $rootScope.scheduleDevice.minute = $scope.selectedMinutes.value;

        function setOrRise() {
            console.log('function setOrRise', $rootScope);
                $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                    console.log('response from options/sun', response);
                });
        }

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

                //console.log('setting sunrise/sunset today');

                if($rootScope.scheduleDevice.dateEnd !== undefined) {

                    var dateBegin = parseDate($rootScope.scheduleDevice.dateBegin, 0, 0, 0, 0);
                    var dateEnd = parseDate($rootScope.scheduleDevice.dateEnd, 0, 0, 0, 0);
                    var days = (dateEnd - dateBegin) / 86400000;
                    console.log(days);
                }

                else if($rootScope.scheduleDevice.recurDaily) {

                    $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/sun', response);
                    });


                    var date = new Date();
                    date.setDate(date.getDate()+1);
                    date.setHours(3);
                    date.setMinutes(0);
                    date.setSeconds(0);


                    var delay = date - new Date();

                    console.log('setting up recurring sunrise/sunset schedule - calling setInterval every 24hrs from ', date);

                    if($rootScope.recurTimeOutID === undefined){

                        var recurTimeOut = setTimeout(function(){

                            console.log('settting upcoming sunset/sunrise control');
                            $rootScope.recurTimeOutID = recurTimeOut;
                            $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                                console.log('response from options/sun', response);
                            });
                            console.log('setting sunset/sunrise control every 24hrs');
                            var x = setInterval(setOrRise, 86400000);
                            $rootScope.scheduleDevice.intervalID = x;
                            clearTimeout(recurTimeOut);
                        }, delay);

                    }


                }

                else {

                    //    $http.post('/cronjobs', $rootScope.scheduleDevice).then(function(response){
                    //    console.log('response from options/cronjobs', response);
                    //});


                        $http.post('/options/sun', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/sun', response);
                    });

                }


            }

            else {
                //$http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
                //    $rootScope.scheduleDevice.sunset = response.data.results.sunset;
                //    $rootScope.scheduleDevice.sunrise = response.data.results.sunrise;
                //}).then(function(response){
                    $http.post('/options/schedule', $rootScope.scheduleDevice).then(function(response){
                        console.log('response from options/schedule', response);
                    });
                //});

            }

        }

        if(option === 'profiles'){

            var devices;

            if(this.profile.profile.devices === null) {
                devices = [];
            } else {
                devices = this.profile.profile.devices;
            }
            //
            devices.push(this.scheduleDevice.mac);

            this.profile.profile.devices = devices;

            $http.post('/profiles', this.profile.profile)
                .then(function(response){
                    console.log(response);
                });

        }
         $rootScope.template.url = "/views/panel.html";
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

