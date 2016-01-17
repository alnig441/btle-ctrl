app.controller('loginCtrl',['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data.acct_type === 'admin'){
                    $location.path('/admin');
                }
                else{$location.path('/panel')}
            });
    };
}]);
