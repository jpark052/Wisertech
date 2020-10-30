const express = require('express')
const app = express()
const port = 3005
const cmd = require("node-cmd")

cmd.get(`ip route get 1.2.3.4 | awk '{print $7}'`, function (err, data, stderr) {
    if (err) {
      console.log('error: ', err)
    }
    app.get('/', (req, res) => {
        res.send(data)
      })
    console.log(`success: `,data)
  })



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})