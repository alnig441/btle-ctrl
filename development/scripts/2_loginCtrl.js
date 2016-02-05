app.controller('loginCtrl',['$scope', '$rootScope', '$http', '$location', '$mdDialog', '$mdMedia', function ($scope, $rootScope, $http, $location, $mdDialog, $mdMedia){

    $rootScope.template = '/views/panel.html';

    $rootScope.edinaa = {};

    $scope.logout = function(){
        $location.path('/default');
    };

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
                controller: LoginDialogController,
                templateUrl: '/views/loginDialog.html',
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
    };

}]);

function LoginDialogController($scope, $mdDialog, $http, $location) {
    $scope.login = function() {
        $http.post('/login/authenticate', $scope.form)
            .then(function(response){
                if(response.data === true){
                    $location.path('/admin');
                }
                else{$location.path('/default');}
            });
        $mdDialog.hide();
    };
    $scope.dismiss = function() {
        $mdDialog.cancel();
    };
}