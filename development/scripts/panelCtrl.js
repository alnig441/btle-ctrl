app.controller('panelCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
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

    $scope.showOptions = function(url){
        console.log('from panelCtrl: ', url);
        $rootScope.template = url;
    };

}]);