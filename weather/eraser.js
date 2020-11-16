// invoke this every four hours

var _ = require('lodash');
const fs = require('fs')
const clients = require('./clientList.json')

module.exports = {

    eraseWarnings: function () {
        clients.forEach(element => {
            element.warningsReceived = []
        });
        
        let stringlist = JSON.stringify(clients, null, "\t")
        
        fs.writeFile('./clientList.json', stringlist, (err) => {   // sample json file. use actual clients file later
            if (err) console.log("Error: ", err)
        })

    }

  };
  
 