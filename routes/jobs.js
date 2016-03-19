var express = require('express'),
    router = express.Router();
var schedule = require('node-schedule');
var call = require('../public/scripts/myFunctions.min.js');

router.get('/',function(req, res, error){

    var tmp = schedule.scheduledJobs;

    var jobs = call.discardNullJobs(tmp);

    //console.log('in get jobs' , jobs);

    res.send(jobs);

});

router.delete('/:name?', function(req, res, error){

    //console.log('in jobs/delete: ', req.params);

    var tmp = schedule.scheduledJobs;
    var remove = tmp[req.params.name];

    if(remove){
        remove.cancel();
    }

    var jobs = call.discardNullJobs(tmp);

    res.send(jobs);

});


module.exports = router;

