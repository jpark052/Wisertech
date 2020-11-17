const https = require('https');
const fs = require('fs')
const data = require('./clientList.json');
const areaList = require('./areaList.json');
const { callbackPromise } = require('nodemailer/lib/shared');

var parseString = require('xml2js').parseString;
let warningTotal = []
let urlProcessed = 0


module.exports = {
    getWarnings: getWarnings
}

function getWarnings(callback) {
    areaList.area.forEach(location => {
        var currentURL = location.URL

        var req = https.get(currentURL, function (res) {
            var xml = '';
            res.on('data', function (chunk) {
                xml += chunk;
            });

            res.on('end', function () {

                parseString(xml, function (err, result) {   // each xml page
                    let warningList = {
                        "location": location.name,
                        "warningDetails": []
                    }
                    var entryList = result.feed.entry
                    entryList.forEach(element => {

                        if (element.category[0].$.term == "Marine Warnings and Watches") {  // grabbing the warning information
                            let newWarning = {}
                            newWarning.title = element.title[0]
                            newWarning.issued = element.summary[0]._
                            let severity = newWarning.title.split(" ", 1)
                            if (severity[0] == "STRONG") {
                                newWarning.severity = "STRONG WIND"
                            } else {
                                newWarning.severity = severity[0]
                            }
                            warningList.warningDetails.push(newWarning)
                        }
                    });

                    warningTotal.push(warningList)
                    urlProcessed += 1

                    if (urlProcessed == areaList.area.length) {
                        // console.log(warningTotal)

                        let stringlist = JSON.stringify(warningTotal, null, "\t")
                        fs.writeFile('./currentWarnings.json', stringlist, (err) => {
                            if (err) console.log("Error: ", err)
                        })
                    }

                });
            });

            req.on('error', function (err) {
                console.log(`error: `, err)
            })
        })
    })
    callback()
}

/*
    use the following when you want to just update current warninings without sending emails to clients.
*/
getWarnings(()=> {console.log("done")})
