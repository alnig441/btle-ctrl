app.controller('adminCtrl',['$scope','$rootScope', '$http', function($scope, $rootScope, $http){

    $scope.addDev = function(){

        $scope.form = this;
        $rootScope.template.url = $rootScope.template.add;

    };

    $scope.submit = function(str){

        console.log('form submission from: ', str, this.installation, $scope);

        if(str == 'add'){

            $http.post('/admin', $scope.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(str == 'delete'){

            $http.delete('/admin/' + this.installation.device.mac)
                .then(function(response){
                    $http.get('/panel')
                        .then(function(response){
                            $rootScope.installations = response.data;
                            console.log(response);
                        });
                });

        }

        if(str == 'update'){

            $http.post('/admin/update', this.installation.device)
                .then(function(response){
                    console.log(response);
                });

        }

    };

}]);
