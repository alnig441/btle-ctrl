app.factory('profilesService',['$http', '$rootScope', function($http, $rootScope) {
    var _profilesFactory = {};

    _profilesFactory.runActive = function(){

        var i;

        console.log('..factory executing acitve profiles..');
        for(var prop in $rootScope.activeProfiles){

            for(i = 0 ; i < $rootScope.activeProfiles[prop].length ; i ++){

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

        if(i === $rootScope.activeProfiles[prop].length){
                $http.get('/jobs')
                    .then(function(response){
                        $rootScope.scheduledJobs = response.data;
                    });
        }
    };

    return _profilesFactory;
}]);

app.factory('refreshService', ['$http', '$rootScope', function($http, $rootScope){

    var _refreshFactory = {};

    _refreshFactory.sunData = function(){

        console.log('..factory refreshing sunData..');

        $http.get('http://api.sunrise-sunset.org/json?lat=44.891123.7201600&lng=-93.359752&formatted=0')
            .then(function (response) {
                $rootScope.sun_data = response.data.results;

            });
    };

    _refreshFactory.panels = function(){

        console.log('..factory refreshing panels..');

        $http.get('/panel')
            .then(function(response){
                $rootScope.panels = response.data;
            });

    };


    return _refreshFactory;

}]);