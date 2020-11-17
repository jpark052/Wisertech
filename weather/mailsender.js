var warningList = require('./currentWarnings.json')
var clientList = require('./clientList.json')
var _ = require('lodash');
var nodemailer = require('nodemailer');
var fs = require('fs')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jae.wisertech@gmail.com',
        pass: 'Helms1Alee!'
    }
});


// Helper function that compares the client's location and the warning's location
function isItMatch(list, word) {
    let len = list.length
    for (i = 0; i < list.length; i++) {
        if (word == list[i]) {
            return true
        }
    }
    return false
}

// assume waring info has been updated
// now iterate each warnings

module.exports = {
    sendMail: function () {
        clientList.forEach(client => {
            warningList.forEach(item => {

                if (isItMatch(client.location, item.location)) {
                    item.warningDetails.forEach(warning => {    // comparing warning info fetced from XML with the warnings that clients have received already
                        let isDuplicated = false
                        client.warningsReceived.forEach(alreadyRecievedWarn => {

                            if (_.isEqual(warning, alreadyRecievedWarn)) {   // Is the client already alerted about the warning?
                                isDuplicated = true
                            }
                        })

                        if (!isDuplicated) {

                            // compare if the client's severity preference matches the warning's severity
                            if (isItMatch(client.severity, warning.severity)) {
                                console.log(`sent email to ${client.name} about ${warning.title}`)

                                var mailOptions = {
                                    from: 'jae.wisertech@gmail.com',    // or use company mail address
                                    to: client.email,
                                    subject: 'Warning Alert',
                                    text: `${warning.title}\n${warning.issued}`
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });

                                // Adding the warning to client file, so we don't send it again
                                let addWarning = {
                                    "title": warning.title,
                                    "issued": warning.issued,
                                    "severity": warning.severity
                                }
                                client.warningsReceived.push(addWarning)
                            }
                        }
                    })
                }
            })
        })
        // Updating the clientFile so it reflects the warnings that clients have received so far
        let newList = JSON.stringify(clientList, null, "\t")

        fs.writeFile('./clientList.json', newList, (err) => {
            if (err) console.log("Error: ", err)
        })
    }
}
