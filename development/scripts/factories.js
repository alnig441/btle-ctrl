app.factory('profilesService',['$http', '$rootScope', function($http, $rootScope) {
    var recurringProfiles = {};

    recurringProfiles.run = function(){

        console.log('..factory executing acitve profiles..');
        for(var prop in $rootScope.activeProfiles){

            for(var i = 0 ; i < $rootScope.activeProfiles[prop].length ; i ++){

                var date;

                if($rootScope.activeProfiles[prop][i].sunset || $rootScope.activeProfiles[prop][i].sunrise){

                    if($rootScope.activeProfiles[prop][i].sunset){
                        date = Date.parse(new Date($rootScope.sun_data.sunset));
                        date += i*1000;
                        $rootScope.activeProfiles[prop][i].sunset = date;
                    }
                    if($rootScope.activeProfiles[prop][i].sunrise){
                        date = Date.parse(new Date($rootScope.sun_data.sunrise));
                        date += i*1000;
                        $rootScope.activeProfiles[prop][i].sunrise = date;

                    }
                    $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);

                }
                else{
                    $rootScope.activeProfiles[prop][i].second = i;
                    $http.post('/options/profile', $rootScope.activeProfiles[prop][i]);
                }
            }
        }
        return;
    };
    return recurringProfiles;
}]);

app.factory('panelService', ['$http', '$rootScope', function($http, $rootScope){

    var panels = {};

    panels.refresh = function(){

    };

    return panels;

}]);

app.factory('sunDataService', ['$http', '$rootScope', function($http, $rootScope){

    var sunData = {};

    sunData.refresh = function(){

        console.log('..factory updating sunData..');

        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.sun_data = response.data.results;

            });
    };

    return sunData;

}]);