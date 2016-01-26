app.controller('panelCtrl',['$scope', '$http', '$location', function($scope, $http, $location){

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
            console.log($scope.panels);
        });

    $scope.newState = function(){

        $scope.device = this.panel.device;

        $http.put('/panel', $scope.device)
            .then(function(response){
                $http.get('/panel')
                    .then(function(response){
                        $scope.panels = response.data;
                    });
            });

    };

    $scope.showOptions = function(){

    };

}]);