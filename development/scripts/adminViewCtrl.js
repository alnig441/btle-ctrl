app.controller('adminViewCtrl',['$scope', '$rootScope', '$http', '$mdMedia', '$mdDialog', 'refreshService', function($scope, $rootScope, $http, $mdMedia, $mdDialog, refreshService){

    console.log('in adminViewCtrl - rootScope: ', $rootScope);

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

        if(option === 'add'){

            $mdDialog.show(configDialog);
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

        }

        if(option === 'modify_device'){

            refreshService.panels();

            $mdDialog.show(configDialog);
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });


        }

        if(option === 'modify_profile'){

            $http.get('/profiles/all')
                .then(function(response){
                    $scope.profiles = response.data;
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

function AdminDialogController($scope, $mdDialog, $http, $rootScope, $location, $mdMedia, refreshService) {

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

        if(choice === 'add') {

            $http.post('/admin', this.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        if(choice === 'update_device') {

            $http.post('/admin/update', this.panel.device)
                .then(function(response){
                    console.log(response);
                }).then(function(response){
                refreshService.panels();
            });

        }

        if(choice === 'delete_device') {

            console.log('in delete_device dialog: ', $rootScope);

            $http.delete('/admin/' + this.panel.device.mac)
                .then(function(response){
                    refreshService.panels();
                });

        }



        if(choice === 'update_profile'){

            $rootScope.recurDailyID = undefined;

            if(this.profile.profile.active){
                if(this.profile.profile.sunset || this.profile.profile.sunrise){
                    this.profile.profile.hour = null;
                    this.profile.profile.minute = null;
                }
                else{
                    this.profile.profile.hour = this.form.setpoint.getHours();
                    this.profile.profile.minute = this.form.setpoint.getMinutes();
                }
            }
            if(!this.profile.profile.active){
                this.profile.profile.hour = null;
                this.profile.profile.minute = null;
            }

            $http.put('/profiles', this.profile)
                .then(function(response){
                    console.log(response);
                }).then(function(response){
            });
        }

        if(choice === 'delete_profile'){

            $http.delete('/profiles/' + this.profile.profile.profile_name)
                .then(function(response){
                    console.log(response);
                });

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