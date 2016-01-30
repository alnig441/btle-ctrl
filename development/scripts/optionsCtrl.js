app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $scope.setSchedule = function(){

        console.log('in optionsCtrl');

        $http.get('/options')
            .then(function(response){
                console.log(response);
            });
    };

    $scope.apply = function(url){

        $rootScope.template = url;
    };

    $scope.return = function(){
        $rootScope.template = "/views/panel.html";
    };

}]);