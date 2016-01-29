app.controller('loginCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $rootScope.template = '/views/panel.html';

    $scope.submit = function(){
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/default');}
            });
    };

    $scope.logout = function(){
        $location.path('/default');
    };
}]);
