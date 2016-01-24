app.controller('viewPaneCtrl',['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){
    $scope.template.url = '/views/scanDev.html';
    console.log($scope.template[url]);

}]);
