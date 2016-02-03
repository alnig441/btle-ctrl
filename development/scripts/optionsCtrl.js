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

    $scope.apply = function(url){


        $rootScope.template = url;
    };

    $scope.return = function(){
        $rootScope.template = "/views/panel.html";
    };

}]);