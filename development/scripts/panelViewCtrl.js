app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    console.log('in panelViewCtrl - rootScope: ', $rootScope);

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
        });

    $scope.newState = function(){

        $scope.device = this.panel.device;

        console.log('newState ', this);

        $http.put('/panel', $scope.device)
            .then(function(response){
                $http.get('/panel')
                    .then(function(response){
                        $scope.panels = response.data;
                    });
            });

    };

    $scope.showOptions = function(url){
        console.log('..changing to options view..', this);
        $rootScope.scheduleDevice = this.panel.device;
        $rootScope.template.url = $rootScope.template[url];
    };

    $scope.switch = function(url){
        console.log('..loading option '+ url +' ..');
        $rootScope.template.url = $rootScope.template[url];

    };

}]);