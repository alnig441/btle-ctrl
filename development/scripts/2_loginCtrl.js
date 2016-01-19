app.controller('loginCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    console.log('loginCtrl: ', $scope);

    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                console.log('response from post: ', response);
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/panel');}
            });
    };
}]);
