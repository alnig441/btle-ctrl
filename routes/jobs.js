var express = require('express'),
    router = express.Router();
var schedule = require('node-schedule');
var call = require('../public/scripts/myFunctions.min.js');

router.get('/:name?',function(req, res, error){

    console.log(req.params);
    var jobs = schedule.scheduledJobs;
    res.send(jobs);

});

router.delete('/:name?', function(req, res, error){

    console.log(req.params);

    var jobs = schedule.scheduledJobs;

    var remove = jobs[req.params.name];

    if(remove){
        remove.cancel();
    }

    res.send(jobs);

});


module.exports = router;




//    var jobs = schedule.scheduledJobs;
//
//    var smsJob = jobs["job_sms_" + reminderId];
//    var callJob = jobs["job_call_" + reminderId];
//
//    if (smsJob) {
//        smsJob.cancel();
//    }
//    if (callJob) {
//        callJob.cancel();
//    }
//    return true;
//}