app.controller('adminCtrl',['$scope','$rootScope', '$http', function($scope, $rootScope, $http){

    $scope.scanDev = function(url){

    };

    $scope.addDev = function(){

        $scope.form = this;
        $rootScope.template.url = $rootScope.template.add;

    };

    $scope.updateDev = function(url){

    };

    $scope.deleteDev = function(url){

    };

    $scope.submit = function(str){

        console.log('form submission from: ', str, $scope.form);

        if(str == 'add'){

            $http.post('/admin', $scope.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(str == 'delete'){


        }

        if(str == 'update'){

        }

    };

}]);
