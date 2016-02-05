app.controller('adminViewCtrl',['$scope', '$rootScope', '$http', '$mdMedia', '$mdDialog', function($scope, $rootScope, $http, $mdMedia, $mdDialog){

    //$rootScope.template = {
    //    default: '/views/panel.html',
    //    scan: '/views/scanDev.html',
    //    add: '/views/addDev.html',
    //    update: '/views/updDev.html',
    //    delete: '/views/delDev.html'
    //};

    //$scope.switch = function(url){
    //
    //    $rootScope.template.url = $rootScope.template[url];
    //
    //    if(url == 'scan'){
    //
    //        $http.get('/admin/scan', $scope)
    //            .then(function(response){
    //                $rootScope.devices = response.data;
    //            })
    //            .then(function(){
    //                $http.get('/admin/reset')
    //                    .then(function(response){
    //                        console.log(response);
    //                    });
    //
    //            });
    //
    //    }
    //
    //    if(url == 'add'){
    //
    //        console.log('from adminViewCtrl add');
    //
    //    }
    //
    //    if(url == 'delete'){
    //
    //        $http.get('/panel')
    //            .then(function(response){
    //                $rootScope.installations = response.data;
    //            });
    //
    //    }
    //
    //    if(url == 'update'){
    //
    //        $http.get('/panel')
    //            .then(function(response){
    //                $rootScope.installations = response.data;
    //            });
    //
    //
    //    }
    //
    //};

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev, option) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        var configDialog = {
            scope: $scope,
            preserveScope: true,
            controller: AdminDialogController,
            templateUrl: $rootScope.panelTemplate[option],
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        };

        if(option === 'delete' || option === 'update'){

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



    };


}]);

function AdminDialogController($scope, $mdDialog, $http, $rootScope, $location, $mdMedia) {

    $scope.submit = function(choice, ev){

        console.log('in AdminDialogController ', choice, $scope);

        if(choice === 'add_from_scan') {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            console.log('adding this device from scan ', this.device);
            $rootScope.form = this;

            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                controller: AdminDialogController,
                templateUrl: $rootScope.panelTemplate.add,
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

            $http.post('/admin', this.form.device)
                .then(function(response){
                    console.log(response);
                });

        }

        $mdDialog.hide();
    };

    $scope.dismiss = function() {
        $mdDialog.cancel();
    };
}