app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $scope.setSchedule = function(url){

        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0').then(function(response){
            $rootScope.edina = response.data.results;
            var date = new Date($rootScope.edina.sunset);
            console.log('Sunset in Edina today: ', date);
        }).then(function(response){
            $http.post('/options/sun', $rootScope.edina).then(function(response){
                console.log('response from options/sun', response);
            });
        });

        $http.get('/options')
            .then(function(response){
                console.log(response);
            });

        $rootScope.template = '/views/panel.html';

    };

    $scope.apply = function(option){
        console.log('in options ctrl - function apply', $scope);

        if(option === 'colour'){

            $http.post('/options/colour', $scope.color)
                .then(function(response){
                    console.log('from options route');
                });

        }

        $rootScope.template = "/views/panel.html";
    };

    $scope.return = function(){
        $rootScope.template = "/views/panel.html";
    };

    $scope.color = {
        red: Math.floor(Math.random() * 255),
        green: Math.floor(Math.random() * 255),
        blue: Math.floor(Math.random() * 255)
    };


}]);