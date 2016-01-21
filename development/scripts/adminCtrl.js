app.controller('adminCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.scanDev = function(){
        $http.get('/admin')
            .then(function(response){
                console.log('svar fra hcitool: ', response.data);
            });

    };

    $scope.addDev = function(){

    };

    $scope.updateDev = function(){

    };

    $scope.deleteDev = function(){

    };

}]);
