app.factory('profilesService',['$http', '$rootScope', 'jobService', function($http, $rootScope, jobService) {
    var _profilesFactory = {};
    var i;

    _profilesFactory.runActive = function(){

        //var i;
        console.log('..factory executing active profiles..', $rootScope.activeProfiles);
        for(var prop in $rootScope.activeProfiles){
            console.log('profileService printing activeProfiles: ', prop);
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

    };

    _profilesFactory.rebuildActive = function(){

        $http.get('/profiles')
            .then(function(response){
                $rootScope.activeProfiles = {};
                response.data.forEach(function(elem, ind, arr){
                    $http.get('/profiles/' + elem.profile.profile_name)
                        .then(function(response){
                            $rootScope.activeProfiles[elem.profile.profile_name] = response.data;
                        });
                });
            });

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

app.factory('jobService', ['$http', '$rootScope', function($http, $rootScope){

    var _jobFactory = {};

    _jobFactory.getJobs = function(){
        console.log('in jobService getJobs');
        $http.get('/jobs')
            .then(function(response){
                $rootScope.scheduledJobs = response.data;
            });
    };

    _jobFactory.deleteJob = function(job){

        console.log('jobService deleteJob: ', job);
        $http.delete('/jobs/' + job )
            .then(function(response){
                $rootScope.scheduledJobs = response.data;
            });
    };

    return _jobFactory;

}]);
