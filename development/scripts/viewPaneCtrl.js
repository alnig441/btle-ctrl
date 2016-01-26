app.controller('viewPaneCtrl',['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    $rootScope.template = {
        default: '/views/default.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };
    $rootScope.template.url = $rootScope.template.default;

    $scope.switch = function(url){

        $rootScope.template.url = $rootScope.template[url];

        if(url == 'scan'){

            $http.get('/admin/scan', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;
                })
                .then(function(){
                    $http.get('/admin/reset')
                        .then(function(response){
                            console.log(response);
                        });

                });

        }

        if(url == 'add'){

        }

        if(url == 'delete'){

            $http.get('/admin/test', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;
                });

        }

        if(url == 'update'){

            $http.get('/admin/test', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;
                });

        }

        if(url == 'test'){


        }
    };


}]);
