app.controller('panelViewCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    //$rootScope.template = {
    $rootScope.panelTemplate = {
        dim: '/views/dim.html',
        schedule: '/views/schedule.html',
        colour: '/views/colour.html',
        options: '/views/options.html',
        profiles: '/views/profiles.html',
        apply: '/views/default.html',
        default: '/views/panel.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };

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
        $rootScope.activeDevice = this.panel.device;
        //$rootScope.template = $rootScope.template[url];
        $rootScope.template = $rootScope.panelTemplate[url];
    };

    $scope.switch = function(url){
        console.log('..loading option '+ url +' ..');
        //$rootScope.template = $rootScope.template[url];
        $rootScope.template = $rootScope.panelTemplate[url];

    };

}]);