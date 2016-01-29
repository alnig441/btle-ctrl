app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){


    $rootScope.panelTemplate = {
        dim: '/views/dim.html',
        schedule: '/views/schedule.html',
        colour: '/views/colour.html',
        options: '/views/options.html',
        apply: '/views/default.html'
    };

    $http.get('/panel')
        .then(function(response){
            $scope.panels = response.data;
            //console.log($scope.panels);
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
        $rootScope.template = $rootScope.panelTemplate[url];
    };

    $scope.switch = function(url){

        console.log('panelViewCtrl switch: ', url);
        $rootScope.template = $rootScope.panelTemplate[url];

    };

}]);