app.controller('optionsCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    $scope.apply = function(url){

        $rootScope.template = url;
    };

}]);