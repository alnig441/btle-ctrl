app.controller('loginCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/panel');}
            });
    };

    $scope.logout = function(){
        $location.path('/panel');
    };
}]);
