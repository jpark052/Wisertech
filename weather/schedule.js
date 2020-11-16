var schedule = require('node-schedule');
var _ = require('lodash');
time = new Date();
var fetchWarningFile = require('./app.js');
var eraser = require('./eraser')
var mailsenderFile = require('./mailsender')


var everyHour = schedule.scheduleJob('0 * * * *', function () {      //executed every hour
  
  // fetch the up-to-date warning info from the weather.gc.ca first then send mails to the clients after
  fetchWarningFile.getWarnings(mailsenderFile.sendMail)
});

//  executed on every 4pm. I decided to do it at 3:55pm instead so that it can erase
//  previous data first.
var every4pm = schedule.scheduleJob('55 15 * * *', function () {
  eraser.eraseWarnings()
});

