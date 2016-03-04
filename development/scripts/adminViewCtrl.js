app.controller('adminViewCtrl',['$scope', '$rootScope', '$http', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $mdMedia, $mdDialog){

    //console.log('in adminViewCtrl - rootScope: ', $rootScope);


    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev, option) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        var configDialog = {
            scope: $scope,
            preserveScope: true,
            controller: AdminDialogController,
            templateUrl: $rootScope.template[option],
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        };

        if(option === 'modify_device'){

            $http.get('/panel')
                .then(function(response){
                    $scope.installations = response.data;

                    $mdDialog.show(configDialog);
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                });



        }

        if(option === 'add'){

            $mdDialog.show(configDialog);
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

        }

        if(option === 'scan'){

            $http.get('/admin/scan', $scope)
                .then(function(response){
                    $rootScope.devices = response.data;

                    $mdDialog.show(configDialog);
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                })
                .then(function(){
                    $http.get('/admin/reset')
                        .then(function(response){
                            console.log(response);
                        });

                });

        }

        if(option === 'modify_profile'){

            $http.get('/profiles')
                .then(function(response){
                    $rootScope.profiles = response.data;
                    $mdDialog.show(configDialog);
                    $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });

                });

        }


    };


}]);

function AdminDialogController($scope, $mdDialog, $http, $rootScope, $location, $mdMedia) {

    //console.log('in adminDialogCtrl - rootScope: ', $rootScope);
    $scope.submit = function(choice, ev){

        //console.log('in AdminDialogController ', choice, $scope);

        if(choice === 'add_from_scan') {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            console.log('adding this device from scan ', $rootScope);
            $rootScope.form = this;

            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                controller: AdminDialogController,
                templateUrl: $rootScope.template.add,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        if(choice === 'delete') {

            $http.delete('/admin/' + this.installation.device.mac)
                .then(function(response){
                    $http.get('/panel')
                        .then(function(response){
                            $rootScope.installations = response.data;
                            console.log(response);
                        });
                });

        }

        if(choice === 'update') {

            $http.post('/admin/update', this.installation.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(choice === 'add') {

            console.log('in add device ');

            if(this.form.profile){
                console.log('we have profile');

                $http.post('/profiles/add', this.form.profile)
                    .then(function(response){
                        console.log(response);
                    });
            }

            if(this.form.device){
                console.log('we have a device');

                $http.post('/admin', this.form.device)
                    .then(function(response){
                        console.log(response);
                    });

            }


        }

        if(choice === 'update_profile'){

            console.log('build code', this);

        }

        if(choice === 'delete_profile'){

            console.log('build code', this);

        }

        $mdDialog.hide();
    };

    $scope.testDev = function() {

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

        var y = setTimeout(killX, 6000);

        function killX(){
            console.log('test interval cleared');
            clearInterval(x);
        }

    };

    $scope.dismiss = function() {
        $mdDialog.cancel();
    };
}