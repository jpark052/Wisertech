const cmd = require("node-cmd")
let ipAddress

cmd.get(`ip route get 1.2.3.4 | awk '{print $7}'`, function (err, data, stderr) {
        if (err) {
          console.log('error: ', err)
        }
        ipAddress = data
      })

      
