app.controller('viewPaneCtrl',['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

    $rootScope.template = {
        default: '/views/default.html',
        scan: '/views/scanDev.html',
        add: '/views/addDev.html',
        update: '/views/updDev.html',
        delete: '/views/delDev.html'
    };

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

            console.log('from viewPaneCtrl add');

        }

        if(url == 'delete'){

            $http.get('/panel')
                .then(function(response){
                    $rootScope.installations = response.data;
                });

        }

        if(url == 'update'){

            $http.get('/panel')
                .then(function(response){
                    $rootScope.installations = response.data;
                });


        }

    };


}]);
