app.controller('adminCtrl',['$scope','$rootScope', '$http', '$location', '$compile', function($scope, $rootScope, $http, $location, $compile){

    $rootScope.template = {
        default: '/views/default.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };
    $rootScope.template.url = $rootScope.template.default;


    $scope.scanDev = function(url){

        $rootScope.template.url = $rootScope.template[url];

        $http.get('/admin/scan', $scope)
            .then(function(response){
                //$scope.devices = response.data;
                //console.log(response);
            })
            .then(function(){
                $http.get('/admin/reset')
                    .then(function(response){
                        //console.log(response);
                    });

            });

    };



    $scope.addDev = function(url){

        $rootScope.template.url = $rootScope.template[url];
    };

    $scope.updateDev = function(url){

        $rootScope.template.url = $rootScope.template[url];

    };

    $scope.deleteDev = function(url){

        $rootScope.template.url = $rootScope.template[url];

    };

}]);
