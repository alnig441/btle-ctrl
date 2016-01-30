app.controller('adminCtrl',['$scope','$rootScope', '$http', function($scope, $rootScope, $http){

    $scope.addDev = function(){

        console.log('in adminCtrl addDev', this);
        $rootScope.form = this;
        console.log('HEJ DER!', $rootScope.form);
        $rootScope.template.url = $rootScope.template.add;

    };

    $scope.testDev = function(){

        var device = {
            mac: this.device.mac,
            state: true
        };

        var x = setInterval(runTest, 1000);
        var state;

        function runTest() {
            $http.post('/admin/test/', device )
                .then(function (response) {
                    device.state = response.data;

                });
        }

        var y = setTimeout(killX, 5000);

        function killX(){
            console.log('test interval cleared');
            clearInterval(x);
        }


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
