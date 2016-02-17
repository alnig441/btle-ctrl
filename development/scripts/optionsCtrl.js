app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', function($scope, $rootScope, $http, $location, $mdDialog){

    $rootScope.scheduleDevice.dateBegin = new Date();

    $scope.apply = function(option){

        $rootScope.scheduleDevice.colour = $scope.color;
        $rootScope.scheduleDevice.hour = $scope.selectedHours.value;
        $rootScope.scheduleDevice.minute = $scope.selectedMinutes.value;

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
        $http.get('/panel');
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

